import { FiDownload, FiMinus, FiPlus, FiRotateCcw } from "react-icons/fi";
import styles from "./styles.module.css";

const SvgPreview = ({ previewUrl, validation, dimensions, zoom, onZoomChange, background, onBackgroundChange, onDownloadSvg, onExportPng, exporting }) => {
    const backgrounds = { checkerboard: styles.checkerboard, white: styles.white, graphite: styles.graphite };

    return (
        <section className={styles.preview} id="preview" aria-labelledby="preview-title">
            <div className={styles.previewHeading}>
                <div className={styles.titleGroup}>
                    <span className={styles.sectionIndex}>02</span>
                    <div><h2 id="preview-title">Live preview</h2><p>See the vector at a useful scale.</p></div>
                </div>
                <span className={styles.dimensionBadge}>{validation.ok ? `${dimensions.width} × ${dimensions.height} px` : "Waiting for SVG"}</span>
            </div>
            <div className={styles.previewToolbar}>
                <label className={styles.backgroundControl}>Canvas
                    <select value={background} onChange={(event) => onBackgroundChange(event.target.value)} aria-label="Preview canvas background">
                        <option value="checkerboard">Checkerboard</option>
                        <option value="white">White</option>
                        <option value="graphite">Graphite</option>
                    </select>
                </label>
                <div className={styles.zoomControls} role="group" aria-label="Preview zoom controls">
                    <button type="button" aria-label="Zoom out" onClick={() => onZoomChange(Math.max(25, zoom - 25))} disabled={zoom <= 25}><FiMinus aria-hidden="true" /></button>
                    <span aria-live="polite">{zoom}%</span>
                    <button type="button" aria-label="Zoom in" onClick={() => onZoomChange(Math.min(200, zoom + 25))} disabled={zoom >= 200}><FiPlus aria-hidden="true" /></button>
                    <button type="button" className={styles.fitButton} onClick={() => onZoomChange(100)} title="Fit preview"><FiRotateCcw aria-hidden="true" /><span>Fit</span></button>
                </div>
            </div>
            <div className={`${styles.previewCanvas} ${backgrounds[background] || backgrounds.checkerboard}`}>
                {validation.ok && previewUrl ? <div className={styles.artwork} style={{ width: `${zoom}%` }}>
                    <img src={previewUrl} alt={`SVG preview, ${dimensions.width} by ${dimensions.height} pixels`} />
                </div> : <div className={styles.emptyPreview}>
                    <span className={styles.emptyIcon} aria-hidden="true">&lt;/&gt;</span>
                    <strong>Waiting for valid SVG</strong>
                    <p>Paste or import well-formed SVG markup to render a preview.</p>
                </div>}
            </div>
            <div className={styles.previewDetails}>
                <div><span>VIEWBOX</span><code>{validation.ok && dimensions.viewBox ? `${dimensions.viewBox.minX} ${dimensions.viewBox.minY} ${dimensions.viewBox.width} ${dimensions.viewBox.height}` : "Not set"}</code></div>
                <div className={styles.exportActions}>
                    <button type="button" className={styles.secondaryButton} onClick={onDownloadSvg} disabled={!validation.ok}><FiDownload aria-hidden="true" /> SVG</button>
                    <button type="button" className={styles.primaryButton} onClick={onExportPng} disabled={!validation.ok || exporting}><FiDownload aria-hidden="true" /> {exporting ? "Rendering" : "Export PNG"}</button>
                </div>
            </div>
        </section>
    );
};

export default SvgPreview;
