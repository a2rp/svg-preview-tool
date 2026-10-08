import { FiArrowRight, FiCode, FiEye, FiLayers, FiShield } from "react-icons/fi";
import SvgStudio from "./components/svgStudio/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import BackToTop from "./components/backToTop/index.jsx";
import styles from "./App.module.css";

const App = () => (
    <div className={styles.appShell} id="top">
        <SiteHeader />
        <main>
            <section className={styles.intro} aria-labelledby="intro-title">
                <div className={styles.introInner}>
                    <div className={styles.introCopy}>
                        <p className={styles.introLabel}><FiLayers aria-hidden="true" /> Vector workspace</p>
                        <h1 id="intro-title">Vectors, without<br /><span>the guesswork.</span></h1>
                        <p className={styles.introDescription}>Edit SVG markup beside its live preview. Check the canvas, inspect dimensions, and export a clean file when it is ready.</p>
                        <div className={styles.introActions}>
                            <a className={styles.startButton} href="#editor">Start editing <FiArrowRight aria-hidden="true" /></a>
                            <span><FiShield aria-hidden="true" /> No uploads. Work stays here.</span>
                        </div>
                    </div>
                    <div className={styles.introArt} role="img" aria-label="Decorative vector preview with editable dimensions">
                        <div className={styles.artHeader}><span className={styles.artDots}><i /><i /><i /></span><span><FiCode aria-hidden="true" /> sample-mark.svg</span><small>SVG</small></div>
                        <div className={styles.artCanvas}>
                            <svg viewBox="0 0 360 220" fill="none" aria-hidden="true">
                                <rect x="1" y="1" width="358" height="218" rx="13" fill="#F6F9F8" />
                                <circle cx="180" cy="110" r="66" stroke="#D7E7E2" strokeWidth="2" />
                                <circle cx="180" cy="110" r="43" stroke="#C1D9D2" strokeWidth="2" />
                                <ellipse cx="180" cy="110" rx="91" ry="39" transform="rotate(-24 180 110)" stroke="#388F83" strokeWidth="3" />
                                <circle cx="249" cy="72" r="7" fill="#57D0BB" />
                                <circle cx="180" cy="110" r="21" fill="#202A2D" />
                                <circle cx="180" cy="110" r="8" fill="#57D0BB" />
                            </svg>
                        </div>
                        <div className={styles.artFooter}><span><i /> Valid vector</span><span>360 × 220</span><span><FiEye aria-hidden="true" /> Live</span></div>
                    </div>
                </div>
                <div className={styles.introRail}><span>EDIT IN PLACE</span><i /><span>PREVIEW SAFELY</span><i /><span>EXPORT WHEN READY</span></div>
            </section>
            <SvgStudio />
            <section className={styles.guide} id="guide" aria-labelledby="guide-title">
                <div className={styles.guideHeading}>
                    <p>How it works</p>
                    <h2 id="guide-title">A quick review before you export.</h2>
                    <span>Keep the source nearby while you inspect how each edit changes the artwork.</span>
                </div>
                <div className={styles.guideGrid}>
                    <article><span><FiCode aria-hidden="true" /></span><div><h3>Edit the source</h3><p>Type markup, drop in a local SVG, or start from one of the built-in examples.</p></div></article>
                    <article><span><FiEye aria-hidden="true" /></span><div><h3>Inspect the render</h3><p>Use the transparent grid, alternate canvas colors, zoom, and intrinsic dimensions to review the result.</p></div></article>
                    <article><span><FiShield aria-hidden="true" /></span><div><h3>Export a clean file</h3><p>Preview-safe SVG and transparent PNG files are prepared locally in your browser.</p></div></article>
                </div>
            </section>
        </main>
        <SiteFooter />
        <BackToTop />
    </div>
);

export default App;
