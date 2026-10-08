import test from "node:test";
import assert from "node:assert/strict";
import {
    formatFileSize,
    getExportDimensions,
    getSvgByteLength,
    parseViewBox,
    prepareSvgPreview,
    resolveSvgDimensions,
} from "./svgTools.js";

test("parses comma and whitespace separated viewBox values", () => {
    assert.deepEqual(parseViewBox("-4, 2 320 180"), { minX: -4, minY: 2, width: 320, height: 180 });
    assert.equal(parseViewBox("0 0 0 12"), null);
    assert.equal(parseViewBox("0 0 10"), null);
});

test("resolves explicit SVG units and falls back to viewBox", () => {
    assert.deepEqual(resolveSvgDimensions("2in", "24pt", "0 0 4 2"), {
        width: 192,
        height: 32,
        aspectRatio: 6,
        viewBox: { minX: 0, minY: 0, width: 4, height: 2 },
    });
    assert.deepEqual(resolveSvgDimensions("50%", "auto", "0 0 640 360"), {
        width: 640,
        height: 360,
        aspectRatio: 640 / 360,
        viewBox: { minX: 0, minY: 0, width: 640, height: 360 },
    });
});

test("provides a usable default for SVGs without dimensions", () => {
    assert.deepEqual(resolveSvgDimensions(null, null, null), { width: 512, height: 512, aspectRatio: 1, viewBox: null });
});

test("limits PNG exports by side length and total pixels", () => {
    const result = getExportDimensions(12000, 9000, 2);
    assert.equal(result.limited, true);
    assert.ok(result.width <= 8192);
    assert.ok(result.height <= 8192);
    assert.ok(result.width * result.height <= 16_000_000);
    assert.deepEqual(getExportDimensions(200, 100, 1), { width: 200, height: 100, scale: 1, limited: false });
});

test("counts UTF-8 bytes and formats useful file sizes", () => {
    assert.equal(getSvgByteLength("<svg>✓</svg>"), 14);
    assert.equal(formatFileSize(900), "900 B");
    assert.equal(formatFileSize(1536), "1.5 KB");
});

const makeElement = (localName, values = {}) => {
    const element = {
        localName,
        attributes: Object.entries(values).map(([name, value]) => ({ name, value })),
        textContent: "",
        removed: false,
        getAttribute(name) { return this.attributes.find((attribute) => attribute.name === name)?.value ?? null; },
        removeAttribute(name) { this.attributes = this.attributes.filter((attribute) => attribute.name !== name); },
        setAttribute(name, value) {
            const attribute = this.attributes.find((entry) => entry.name === name);
            if (attribute) attribute.value = value;
            else this.attributes.push({ name, value });
        },
        remove() { this.removed = true; },
    };
    return element;
};

test("removes active content and external references before preview", () => {
    const root = makeElement("svg", { width: "320", height: "180", viewBox: "0 0 320 180" });
    const graphic = makeElement("image", {
        onload: "run()",
        href: "https://example.test/pixel.png",
        fill: "url(https://example.test/fill.svg#paint)",
        style: "color:teal;background-image:url(https://example.test/tile.png)",
    });
    const script = makeElement("script");
    const style = makeElement("style");
    style.textContent = "@import url(https://example.test/theme.css); .mark{fill:url(#paint)}";
    const elements = [root, graphic, style];
    const document = {
        documentElement: root,
        querySelector: () => null,
        querySelectorAll: (selector) => {
            if (selector.startsWith("script,")) return [script];
            if (selector === "*") return elements;
            if (selector === "style") return [style];
            return [];
        },
    };
    class MockParser { parseFromString() { return document; } }
    class MockSerializer { serializeToString() { return "<svg cleaned='true'/>"; } }

    const result = prepareSvgPreview("<svg />", MockParser, MockSerializer);
    assert.equal(result.ok, true);
    assert.equal(result.markup, "<svg cleaned='true'/>");
    assert.equal(result.dimensions.width, 320);
    assert.equal(script.removed, true);
    assert.equal(graphic.getAttribute("onload"), null);
    assert.equal(graphic.getAttribute("href"), null);
    assert.equal(graphic.getAttribute("fill"), "none");
    assert.match(graphic.getAttribute("style"), /color:teal/);
    assert.doesNotMatch(graphic.getAttribute("style"), /example\.test/);
    assert.doesNotMatch(style.textContent, /@import|example\.test/);
    assert.match(style.textContent, /url\(#paint\)/);
    assert.ok(result.removedCount >= 5);
});

test("rejects documents with a parser error or document type declaration", () => {
    const parserError = { documentElement: null, querySelector: () => ({}), querySelectorAll: () => [] };
    class BrokenParser { parseFromString() { return parserError; } }
    class MockSerializer { serializeToString() { return ""; } }
    assert.equal(prepareSvgPreview("<svg>", BrokenParser, MockSerializer).error, "The SVG markup is not valid XML.");
    assert.equal(prepareSvgPreview("<!DOCTYPE svg><svg/>").error, "Document type declarations are not supported.");
});
