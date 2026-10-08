export const maxSvgBytes = 1_000_000;
export const maxExportPixels = 16_000_000;
export const maxExportSide = 8192;

const parseSvgLength = (value) => {
    if (typeof value === "number") return Number.isFinite(value) && value > 0 ? value : null;
    const match = String(value ?? "").trim().match(/^([\d.]+)\s*(px|in|cm|mm|pt|pc)?$/i);
    if (!match) return null;

    const amount = Number(match[1]);
    if (!Number.isFinite(amount) || amount <= 0) return null;
    const units = { px: 1, in: 96, cm: 96 / 2.54, mm: 96 / 25.4, pt: 96 / 72, pc: 16 };
    return amount * (units[(match[2] || "px").toLowerCase()] || 1);
};

export const parseViewBox = (value) => {
    const values = String(value ?? "").trim().split(/[\s,]+/).map(Number);
    if (values.length !== 4 || values.some((number) => !Number.isFinite(number)) || values[2] <= 0 || values[3] <= 0) return null;
    return { minX: values[0], minY: values[1], width: values[2], height: values[3] };
};

export const resolveSvgDimensions = (widthValue, heightValue, viewBoxValue) => {
    const viewBox = typeof viewBoxValue === "string" ? parseViewBox(viewBoxValue) : viewBoxValue;
    const width = parseSvgLength(widthValue) || viewBox?.width || 512;
    const height = parseSvgLength(heightValue) || viewBox?.height || 512;
    return {
        width: Math.max(1, Math.round(width)),
        height: Math.max(1, Math.round(height)),
        aspectRatio: width / height,
        viewBox,
    };
};

export const getExportDimensions = (width, height, requestedScale = 1) => {
    const safeWidth = Number.isFinite(width) && width > 0 ? width : 512;
    const safeHeight = Number.isFinite(height) && height > 0 ? height : 512;
    const safeScale = Number.isFinite(requestedScale) && requestedScale > 0 ? requestedScale : 1;
    const pixelLimitScale = Math.sqrt(maxExportPixels / (safeWidth * safeHeight));
    const sideLimitScale = Math.min(maxExportSide / safeWidth, maxExportSide / safeHeight);
    const scale = Math.min(safeScale, pixelLimitScale, sideLimitScale);
    return {
        width: Math.max(1, Math.floor(safeWidth * scale)),
        height: Math.max(1, Math.floor(safeHeight * scale)),
        scale,
        limited: scale < safeScale,
    };
};

export const getSvgByteLength = (source) => new TextEncoder().encode(String(source)).length;

export const formatFileSize = (byteLength) => {
    if (!Number.isFinite(byteLength) || byteLength < 0) return "0 B";
    if (byteLength < 1024) return `${byteLength} B`;
    const kilobytes = byteLength / 1024;
    return `${kilobytes < 10 ? kilobytes.toFixed(1) : Math.round(kilobytes)} KB`;
};

const sanitizeCss = (css) => String(css)
    .replace(/@import\s+[^;]+;?/gi, "")
    .replace(/url\(\s*(?:(['"])(.*?)\1|([^)]*?))\s*\)/gi, (_match, _quote, quoted, plain) => {
        const target = String(quoted ?? plain ?? "").trim();
        return target.startsWith("#") ? `url(${target})` : "none";
    })
    .replace(/expression\s*\([^)]*\)/gi, "none")
    .replace(/javascript\s*:/gi, "");

export const prepareSvgPreview = (source, Parser = globalThis.DOMParser, Serializer = globalThis.XMLSerializer) => {
    const text = String(source ?? "");
    if (!text.trim()) return { ok: false, error: "Add SVG markup to see a preview." };
    if (getSvgByteLength(text) > maxSvgBytes) return { ok: false, error: "SVG markup must be 1 MB or smaller." };
    if (/<!DOCTYPE|<!ENTITY/i.test(text)) return { ok: false, error: "Document type declarations are not supported." };
    if (typeof Parser !== "function" || typeof Serializer !== "function") return { ok: false, error: "This browser does not support SVG parsing." };

    try {
        const document = new Parser().parseFromString(text, "image/svg+xml");
        if (document.querySelector("parsererror")) return { ok: false, error: "The SVG markup is not valid XML." };
        const root = document.documentElement;
        if (!root || root.localName?.toLowerCase() !== "svg") return { ok: false, error: "The document root must be an SVG element." };

        let removedCount = 0;
        document.querySelectorAll("script, foreignObject, iframe, object, embed, audio, video, link").forEach((element) => {
            element.remove();
            removedCount += 1;
        });

        document.querySelectorAll("*").forEach((element) => {
            Array.from(element.attributes).forEach((attribute) => {
                const name = attribute.name.toLowerCase();
                const value = attribute.value.trim();
                if (name.startsWith("on") || name === "src" || /javascript\s*:/i.test(value)) {
                    element.removeAttribute(attribute.name);
                    removedCount += 1;
                    return;
                }
                if (name === "href" || name.endsWith(":href")) {
                    if (!value.startsWith("#")) {
                        element.removeAttribute(attribute.name);
                        removedCount += 1;
                    }
                    return;
                }
                if (name === "style" || /url\s*\(/i.test(value)) {
                    const cleanedValue = name === "style" ? sanitizeCss(value) : value.replace(/url\(\s*[^#][^)]*\)/gi, "none");
                    if (cleanedValue !== value) removedCount += 1;
                    element.setAttribute(attribute.name, cleanedValue);
                }
            });
        });

        document.querySelectorAll("style").forEach((element) => {
            const cleanedValue = sanitizeCss(element.textContent);
            if (cleanedValue !== element.textContent) removedCount += 1;
            element.textContent = cleanedValue;
        });

        const dimensions = resolveSvgDimensions(root.getAttribute("width"), root.getAttribute("height"), root.getAttribute("viewBox"));
        return {
            ok: true,
            markup: new Serializer().serializeToString(root),
            dimensions,
            removedCount,
        };
    } catch {
        return { ok: false, error: "The SVG could not be parsed. Check the markup and try again." };
    }
};
