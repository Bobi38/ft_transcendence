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
    const [totalSize, setTotalSize] = useState(0);

    useEffect(() => {
        if (!rootRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                const currentTotal = isCol ? height : width;

                setTotalSize(currentTotal);
                
                setSize1(prev => Math.min(prev, currentTotal - thickness - min2));
            }
        });

        resizeObserver.observe(rootRef.current);
        return () => resizeObserver.disconnect();
    }, [isCol, min2, thickness]);

    const onPointerMove = useCallback((e) => {
        if (!isDragging.current || !rootRef.current) return;

        const rect = rootRef.current.getBoundingClientRect();
        const currentPos = isCol ? (e.clientY - rect.top) : (e.clientX - rect.left);
        
        const clampedPos = Math.max(min1, Math.min(currentPos, totalSize - thickness - min2));

        setSize1(clampedPos);

    }, [min1, min2, totalSize, isCol, thickness]);


    useEffect(() => {
        const stop = () => {
            isDragging.current = false;
            document.body.style.cursor = 'default';
        };
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', stop);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', stop);
        };
    }, [onPointerMove]);

    const size2 = totalSize - size1 - thickness;

    return (
        <div ref={rootRef} className="Hr-root" style={{ display: 'flex', flexDirection: mode, width: '100%', height: '100%' }}>
            <div style={{ [isCol ? 'height' : 'width']: `${size1}px` }}>
                {children[0]}
            </div>
                    
            <hr onPointerDown={() => { isDragging.current = true; document.body.style.cursor = isCol ? 'row-resize' : 'col-resize'; }}
                style={{ [isCol ? 'height' : 'width']: thickness, cursor: isCol ? 'row-resize' : 'col-resize', 
                background: 'black', border: 'none', margin: 0}}
            />

            <div style={{ [isCol ? 'height' : 'width']: `${size2}px` }}>
                {children[1]}
            </div>
        </div>
    );
}