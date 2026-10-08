import { FiArrowUpRight, FiBox, FiGithub } from "react-icons/fi";
import styles from "./styles.module.css";

const SiteHeader = () => (
    <header className={styles.header}>
        <div className={styles.headerInner}>
            <a className={styles.brand} href="#top" aria-label="SVG Preview Tool home">
                <span className={styles.brandMark}><FiBox aria-hidden="true" /></span>
                <span><strong>vector desk</strong><small>SVG PREVIEW TOOL</small></span>
            </a>
            <nav className={styles.navigation} aria-label="Main navigation">
                <a href="#editor">Editor</a>
                <a href="#preview">Preview</a>
                <a href="#guide">Guide</a>
            </nav>
            <a className={styles.repositoryLink} href="https://github.com/a2rp/svg-preview-tool" target="_blank" rel="noreferrer" aria-label="Repository on GitHub, opens in a new tab">
                <FiGithub aria-hidden="true" /><span>Repository</span><FiArrowUpRight aria-hidden="true" className={styles.externalIcon} />
            </a>
        </div>
    </header>
);

export default SiteHeader;
