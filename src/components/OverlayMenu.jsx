import React from 'react';
import styles from './OverlayMenu.module.css';

const OverlayMenu = ({ visible, onClose, onHome, onBack, parentStoryTitle, currentStoryTitle, onRestart }) => {
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
                {onBack && parentStoryTitle && (
                    <li className={styles.menuItem}>
                        <button className={styles.menuButton} onClick={onBack}>
                            Exit to "{parentStoryTitle}"
                        </button>
                    </li>
                )}
                <li className={styles.menuItem}>
                    <button className={styles.menuButton} onClick={onRestart}>
                        Restart {currentStoryTitle ? `"${currentStoryTitle}"` : 'Topic'}
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
                <li className={styles.menuItem}>
                    <button className={styles.menuButton} onClick={onClose}>
                        Close
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default OverlayMenu;
