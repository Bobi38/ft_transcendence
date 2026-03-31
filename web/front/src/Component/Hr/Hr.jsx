/* extern */
import React, { useState, useRef, useEffect, useCallback } from 'react';


/* Css */
import "./Hr.scss";

/* Components */

export default function Hr({ children, mode = 'row', min1 = 100, min2 = 100, initial = 200, thickness = 4 }) {
    const rootRef = useRef(null);
    const isDragging = useRef(false);
    const isCol = mode === 'column';

    const [size1, setSize1] = useState(initial);

    const onPointerMove = useCallback((e) => {
        if (!isDragging.current || !rootRef.current) return;

        const rect = rootRef.current.getBoundingClientRect();
        const totalSize = isCol ? rect.height : rect.width;
        const currentPos = isCol ? (e.clientY - rect.top) : (e.clientX - rect.left);

        const clampedPos = Math.max(min1, Math.min(currentPos, totalSize - thickness - min2));

        setSize1(clampedPos);
    }, [min1, min2, isCol, thickness]);

    useEffect(() => {
        const stop = () => { isDragging.current = false; };
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', stop);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', stop);
        };
    }, [onPointerMove]);

    return (
        <div ref={rootRef} className="Hr-root"
            style={{
                display: 'flex',
                flexDirection: mode,
                width: '100%',
                height: '100%',
            }}
        >
            <div style={{[isCol ? 'height' : 'width']: `${size1}px`, }}>
                {children[0]}
            </div>

            <hr className='hr-custom' onPointerDown={(e) => {
                    //e.preventDefault();
                    isDragging.current = true;
                }}
                style={{
                    [isCol ? 'height' : 'width']: thickness,
                }}
            />

            <div style={{ flex: 1, overflow: 'auto' }}>
                {children[1]}
            </div>
        </div>
    );
}