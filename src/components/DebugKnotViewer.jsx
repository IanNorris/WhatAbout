import React, { useState } from 'react';
import styles from './DebugKnotViewer.module.css';

const DebugKnotViewer = ({ currentKnot, availableKnots, onNavigateToKnot }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleKnotClick = (knot) => {
        onNavigateToKnot(knot);
        setIsOpen(false);
    };

    return (
        <>
            <button
                className={styles.piButton}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Debug"
                title="Debug"
            >
                π
            </button>

            {isOpen && (
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3>Debug</h3>
                        <button
                            className={styles.closeButton}
                            onClick={() => setIsOpen(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>

                    <div className={styles.currentKnot}>
                        <div className={styles.knotPath}>
                            {currentKnot || 'Main'}
                        </div>
                    </div>

                    <div className={styles.knotList}>
                        {availableKnots.length > 0 ? (
                            availableKnots.map((knot) => (
                                <button
                                    key={knot}
                                    className={`${styles.knotButton} ${
                                        currentKnot === knot ? styles.activeKnot : ''
                                    }`}
                                    onClick={() => handleKnotClick(knot)}
                                >
                                    {knot}
                                </button>
                            ))
                        ) : (
                            <div className={styles.noKnots}>No named knots found</div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default DebugKnotViewer;
