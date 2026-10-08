import { useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import styles from "./styles.module.css";

const ReplaceConfirm = ({ itemName, onCancel, onConfirm }) => {
    const cancelRef = useRef(null);
    const confirmRef = useRef(null);

    useEffect(() => {
        const previousFocus = document.activeElement;
        cancelRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onCancel();
                return;
            }
            if (event.key === "Tab") {
                const first = cancelRef.current;
                const last = confirmRef.current;
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            if (previousFocus instanceof HTMLElement) previousFocus.focus();
        };
    }, [onCancel]);

    return (
        <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
            <section className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="replace-title" aria-describedby="replace-description">
                <span className={styles.warningIcon}><FiAlertTriangle aria-hidden="true" /></span>
                <h2 id="replace-title">Replace the current SVG?</h2>
                <p id="replace-description">This loads <strong>{itemName}</strong> into the editor and replaces the markup currently there.</p>
                <div className={styles.actions}>
                    <button ref={cancelRef} className={styles.cancelButton} type="button" onClick={onCancel}>Keep editing</button>
                    <button ref={confirmRef} className={styles.confirmButton} type="button" onClick={onConfirm}>Replace SVG</button>
                </div>
            </section>
        </div>
    );
};

export default ReplaceConfirm;
