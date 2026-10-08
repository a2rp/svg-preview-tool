import { useEffect, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiClipboard, FiFilePlus, FiUpload } from "react-icons/fi";
import { formatFileSize, maxSvgBytes } from "../../utils/svgTools.js";
import styles from "./styles.module.css";

const SvgEditor = ({ source, onSourceChange, byteCount, validation, samples, onChooseFile, onRequestReplace, message, onMessage }) => {
    const fileInputRef = useRef(null);
    const sampleMenuRef = useRef(null);
    const [sampleMenuOpen, setSampleMenuOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [copyState, setCopyState] = useState("idle");

    useEffect(() => {
        if (!sampleMenuOpen) return undefined;
        const closeOutside = (event) => {
            if (!sampleMenuRef.current?.contains(event.target)) setSampleMenuOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setSampleMenuOpen(false);
        };
        window.addEventListener("pointerdown", closeOutside);
        window.addEventListener("keydown", closeOnEscape);
        return () => {
            window.removeEventListener("pointerdown", closeOutside);
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [sampleMenuOpen]);

    const chooseFile = (file) => {
        if (!file) return;
        setSampleMenuOpen(false);
        onChooseFile(file);
    };

    const handleChange = (event) => {
        const nextSource = event.target.value;
        if (new Blob([nextSource]).size > maxSvgBytes) {
            onMessage("SVG markup is limited to 1 MB. Trim the selection and try again.");
            return;
        }
        onMessage("");
        onSourceChange(nextSource);
    };

    const copySource = async () => {
        try {
            await navigator.clipboard.writeText(source);
            setCopyState("copied");
            onMessage("SVG source copied.");
        } catch {
            setCopyState("unavailable");
            onMessage("Clipboard access is unavailable in this browser.");
        }
        window.setTimeout(() => setCopyState("idle"), 1800);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        chooseFile(event.dataTransfer.files?.[0]);
    };

    return (
        <section className={styles.editor} id="editor" aria-labelledby="editor-title">
            <div className={styles.editorHeading}>
                <div className={styles.titleGroup}>
                    <span className={styles.sectionIndex}>01</span>
                    <div><h2 id="editor-title">SVG source</h2><p>Edit the markup or bring in a file.</p></div>
                </div>
                <span className={`${styles.validationBadge} ${validation.ok ? styles.valid : styles.invalid}`}>
                    <i aria-hidden="true" />{validation.ok ? "Ready" : "Check markup"}
                </span>
            </div>
            <div className={styles.toolbar}>
                <button className={styles.actionButton} type="button" onClick={() => fileInputRef.current?.click()}><FiUpload aria-hidden="true" /> Import SVG</button>
                <input ref={fileInputRef} className={styles.fileInput} type="file" accept=".svg,image/svg+xml" aria-label="Choose an SVG file" onChange={(event) => { chooseFile(event.target.files?.[0]); event.target.value = ""; }} />
                <div className={styles.sampleMenu} ref={sampleMenuRef}>
                    <button className={styles.actionButton} type="button" aria-expanded={sampleMenuOpen} aria-haspopup="true" onClick={() => setSampleMenuOpen((open) => !open)}><FiFilePlus aria-hidden="true" /> Samples <FiChevronDown aria-hidden="true" className={styles.chevron} /></button>
                    {sampleMenuOpen && <div className={styles.samplePanel} aria-label="Choose a sample SVG">
                        {samples.map((sample) => <button type="button" key={sample.name} onClick={() => { setSampleMenuOpen(false); onRequestReplace({ kind: "sample", sample }); }}><strong>{sample.name}</strong><small>{sample.detail}</small></button>)}
                    </div>}
                </div>
                <button className={styles.copyButton} type="button" onClick={copySource}><FiClipboard aria-hidden="true" /> {copyState === "copied" ? "Copied" : copyState === "unavailable" ? "Copy unavailable" : "Copy source"}</button>
            </div>
            <div className={`${styles.codeArea} ${isDragging ? styles.dragging : ""}`} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false); }} onDrop={handleDrop}>
                <div className={styles.editorGutter} aria-hidden="true"><span>SVG</span><span>{String(Math.max(1, source.split("\n").length)).padStart(2, "0")}</span></div>
                <textarea value={source} onChange={handleChange} spellCheck="false" autoCapitalize="off" autoComplete="off" autoCorrect="off" aria-label="SVG markup" aria-invalid={!validation.ok} aria-describedby="editor-help editor-error" />
                {isDragging && <div className={styles.dropOverlay}><FiUpload aria-hidden="true" /><span>Drop an SVG file to import it</span></div>}
            </div>
            <div className={styles.editorMeta}>
                <p id="editor-help">{formatFileSize(byteCount)} <span /> {source ? "UTF-8 source" : "Waiting for markup"}</p>
                <p>{validation.ok ? <><FiCheck aria-hidden="true" /> XML parsed</> : "Up to 1 MB"}</p>
            </div>
            <p className={styles.editorMessage} id="editor-error" role="status">{message || (!validation.ok ? validation.error : "")}</p>
        </section>
    );
};

export default SvgEditor;
