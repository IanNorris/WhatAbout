import React from 'react';
import styles from './OverlayMenu.module.css';

const OverlayMenu = ({ visible, onClose, onHome, onRestart }) => {
    if (!visible) return null;

    return (
        <div className={styles.overlayContainer}>
            <button className={styles.closeOverlayButton} onClick={onClose} aria-label="Close Menu">
                &times;
            </button>

            <ul className={styles.menuList}>
                <li className={styles.menuItem}>
                    <button className={styles.menuButton} onClick={onHome}>
                        Back to Hub
                    </button>
                </li>
                <li className={styles.menuItem}>
                    <button className={styles.menuButton} onClick={onRestart}>
                        Restart Topic
                    </button>
                </li>
                <li className={styles.menuItem}>
                    <button className={styles.menuButton} onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        // In a real app we might show a toast, but alert is fine for now
                        alert("Link copied to clipboard!");
                    }}>
                        Share This Thought
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default OverlayMenu;
