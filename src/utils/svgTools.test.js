import test from "node:test";
import assert from "node:assert/strict";
import {
    formatFileSize,
    getExportDimensions,
    getSvgByteLength,
    parseViewBox,
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
