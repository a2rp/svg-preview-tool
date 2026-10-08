import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiShield, FiZap } from "react-icons/fi";
import { sampleSvgs } from "../../data/sampleSvgs.js";
import { formatFileSize, getExportDimensions, getSvgByteLength, maxSvgBytes, prepareSvgPreview } from "../../utils/svgTools.js";
import ReplaceConfirm from "../replaceConfirm/index.jsx";
import SvgEditor from "../svgEditor/index.jsx";
import SvgPreview from "../svgPreview/index.jsx";
import styles from "./styles.module.css";

const startingSvg = sampleSvgs[0].markup;

const SvgStudio = () => {
    const [source, setSource] = useState(startingSvg);
    const [analysis, setAnalysis] = useState(() => ({ source: startingSvg, result: prepareSvgPreview(startingSvg), previewUrl: "" }));
    const [zoom, setZoom] = useState(100);
    const [background, setBackground] = useState("checkerboard");
    const [notice, setNotice] = useState("");
    const [pendingReplacement, setPendingReplacement] = useState(null);
    const [exporting, setExporting] = useState(false);
    const isFirstRender = useRef(true);

    useEffect(() => {
        const initialRender = isFirstRender.current;
        isFirstRender.current = false;
        const timerId = window.setTimeout(() => {
            const result = prepareSvgPreview(source);
            const previewUrl = result.ok
                ? URL.createObjectURL(new Blob([result.markup], { type: "image/svg+xml;charset=utf-8" }))
                : "";
            setAnalysis({ source, result, previewUrl });
        }, initialRender ? 0 : 130);
        return () => window.clearTimeout(timerId);
    }, [source]);

    const validation = useMemo(() => analysis.source === source && analysis.result
        ? analysis.result
        : { ok: false, error: "Checking SVG markup..." }, [analysis, source]);
    const previewUrl = analysis.source === source ? analysis.previewUrl : "";

    useEffect(() => {
        const url = analysis.previewUrl;
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [analysis.previewUrl]);

    const updateSource = useCallback((nextSource) => {
        setSource(nextSource);
        setNotice("");
    }, []);

    const requestReplacement = useCallback((replacement) => {
        setNotice("");
        setPendingReplacement(replacement);
    }, []);

    const chooseFile = useCallback((file) => {
        if (!file.name.toLowerCase().endsWith(".svg")) {
            setNotice("Choose a file with the .svg extension.");
            return;
        }
        if (file.size > maxSvgBytes) {
            setNotice("SVG files must be 1 MB or smaller.");
            return;
        }
        requestReplacement({ kind: "file", file });
    }, [requestReplacement]);

    const confirmReplacement = useCallback(async () => {
        const replacement = pendingReplacement;
        setPendingReplacement(null);
        if (!replacement) return;

        if (replacement.kind === "sample") {
            updateSource(replacement.sample.markup);
            setNotice(`${replacement.sample.name} loaded. Your previous editor text was replaced.`);
            return;
        }

        try {
            const nextSource = await replacement.file.text();
            if (getSvgByteLength(nextSource) > maxSvgBytes) {
                setNotice("SVG files must be 1 MB or smaller. Your current text was kept.");
                return;
            }
            updateSource(nextSource);
            setNotice(`${replacement.file.name} loaded. Check the preview before exporting.`);
        } catch {
            setNotice("That file could not be read. Your current text was kept.");
        }
    }, [pendingReplacement, updateSource]);

    const cancelReplacement = useCallback(() => setPendingReplacement(null), []);

    const downloadSvg = useCallback(() => {
        if (!validation.ok) return;
        const url = URL.createObjectURL(new Blob([validation.markup], { type: "image/svg+xml;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "vector-artwork.svg";
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        setNotice("The preview-safe SVG was downloaded.");
    }, [validation]);

    const exportPng = useCallback(async () => {
        if (!validation.ok || !previewUrl) return;
        setExporting(true);
        setNotice("");
        try {
            const image = new Image();
            await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = () => reject(new Error("The SVG preview could not be loaded."));
                image.src = previewUrl;
            });
            const output = getExportDimensions(validation.dimensions.width, validation.dimensions.height, 2);
            const canvas = document.createElement("canvas");
            canvas.width = output.width;
            canvas.height = output.height;
            const context = canvas.getContext("2d");
            if (!context) throw new Error("PNG export is not available in this browser.");
            context.drawImage(image, 0, 0, output.width, output.height);
            const png = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
            if (!png) throw new Error("The PNG could not be created.");
            const url = URL.createObjectURL(png);
            const link = document.createElement("a");
            link.href = url;
            link.download = "vector-artwork.png";
            link.click();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
            const sizeNote = output.limited ? " Export size was reduced to stay within the pixel limit." : "";
            setNotice(`PNG exported at ${output.width} × ${output.height} pixels.${sizeNote}`);
        } catch (error) {
            setNotice(error.message || "The PNG export failed.");
        } finally {
            setExporting(false);
        }
    }, [previewUrl, validation]);

    const byteCount = getSvgByteLength(source);
    const replacementName = pendingReplacement?.kind === "file"
        ? `${pendingReplacement.file.name} (${formatFileSize(pendingReplacement.file.size)})`
        : pendingReplacement?.sample.name || "the selected sample";

    return (
        <section className={styles.studio} aria-labelledby="studio-title">
            <div className={styles.studioHeading}>
                <div><p className={styles.sectionLabel}><FiZap aria-hidden="true" /> Your workspace</p><h2 id="studio-title">Markup in. pixels out.</h2></div>
                <div className={styles.privacyNote}><FiShield aria-hidden="true" /><span>Files stay in this browser</span></div>
            </div>
            <div className={styles.workspace}>
                <SvgEditor source={source} onSourceChange={updateSource} byteCount={byteCount} validation={validation} samples={sampleSvgs} onChooseFile={chooseFile} onRequestReplace={requestReplacement} message={notice} onMessage={setNotice} />
                <SvgPreview previewUrl={previewUrl} validation={validation} dimensions={validation.dimensions || { width: 0, height: 0, viewBox: null }} zoom={zoom} onZoomChange={setZoom} background={background} onBackgroundChange={setBackground} onDownloadSvg={downloadSvg} onExportPng={exportPng} exporting={exporting} />
            </div>
            <div className={styles.safetyNote}><FiCheck aria-hidden="true" /><p><strong>Safe preview.</strong> Scripts, embedded HTML, and external references are removed before rendering. SVG downloads use the cleaned preview markup.</p><span>{validation.ok ? `${validation.removedCount} cleaned` : "XML check"}</span></div>
            {notice && <p className={styles.announcement} role="status" aria-live="polite">{notice}</p>}
            {pendingReplacement && <ReplaceConfirm itemName={replacementName} onCancel={cancelReplacement} onConfirm={confirmReplacement} />}
        </section>
    );
};

export default SvgStudio;
