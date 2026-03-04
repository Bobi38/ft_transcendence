/* extern */
import React, { useState, useRef, useEffect, useCallback } from 'react';

/* back */
import checkCo from "BACK/fct1.js"

/* Css */
import "./Hr.scss";

/* Components */

export default function Hr({     children,     mode = 'row',     min = 100,     initial = 200,  thickness = '4px'})  {
    
    const rootRef = useRef(null);
    const isCol = mode === 'column';
    const isDragging = useRef(false);
    const [size, setSize] = useState(initial);
    const [maxSize, setMaxSize] = useState(1100);

    useEffect(() => {
        if (!rootRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {

            const { width, height } = entry.contentRect;

            const newMax = (isCol ? height : width) - min;
            setMaxSize(newMax);
            
            setSize(prev => Math.min(prev, newMax));
        }
        });

        resizeObserver.observe(rootRef.current);
        return () => resizeObserver.disconnect();
    }, [isCol]);

    const onPointerMove = useCallback((e) => {

        if (!isDragging.current || !rootRef.current) return;

        const rect = rootRef.current.getBoundingClientRect();

        const currentPos = isCol ? (e.clientY - rect.top) : (e.clientX - rect.left);
        
        if (currentPos >= min && currentPos <= maxSize) {
            setSize(currentPos);
        }

    }, [min, maxSize, isCol]);

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

    return (
        <div ref={rootRef} className="Hr-root" style={{ display: 'flex', flexDirection: mode }}>

        <div style={{ [isCol ? 'height' : 'width']: `${size}px`, overflow: 'auto' }}>
            {children[0]}
        </div>

        <hr onPointerDown={() => { isDragging.current = true; document.body.style.cursor = isCol ? 'row-resize' : 'col-resize'; }}
            style={{ [isCol ? 'height' : 'width']: thickness, cursor: isCol ? 'row-resize' : 'col-resize', 
                background: 'black', border: 'none', margin: 0}}
        />

        <div style={{ flex: 1, overflow: 'auto' }}>
            {children.slice(1)}
        </div>
        </div>
    );
}