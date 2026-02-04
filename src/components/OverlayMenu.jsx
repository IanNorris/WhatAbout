import React from 'react';
import styles from './OverlayMenu.module.css';

const OverlayMenu = ({ visible, onClose, onHome, onBack, parentStoryTitle, currentStoryTitle, onRestart }) => {
    if (!visible) return null;

    // If there's a parent story, make "Exit to parent" the primary option
    const hasParent = onBack && parentStoryTitle;

    return (
        <div className={styles.overlayContainer}>
            <button className={styles.closeOverlayButton} onClick={onClose} aria-label="Close Menu">
                &times;
            </button>

            <ul className={styles.menuList}>
                {hasParent && (
                    <li className={styles.menuItem}>
                        <button className={`${styles.menuButton} ${styles.primaryButton}`} onClick={onBack}>
                            ← Back to "{parentStoryTitle}"
                        </button>
                    </li>
                )}
                <li className={styles.menuItem}>
                    <button className={styles.menuButton} onClick={onHome}>
                        {hasParent ? 'Back to Hub' : '← Back to Hub'}
                    </button>
                </li>
                <li className={styles.menuItem}>
                    <button className={styles.menuButton} onClick={onRestart}>
                        Restart {currentStoryTitle ? `"${currentStoryTitle}"` : 'Topic'}
                    </button>
                </li>
                <li className={styles.menuItem}>
                    <button className={styles.menuButton} onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
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
