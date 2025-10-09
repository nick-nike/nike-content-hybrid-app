import { select } from 'd3-selection';
import type { D3ZoomEvent } from 'd3-zoom';
import { zoom, zoomIdentity } from 'd3-zoom';
import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

type ZoomTransform = { x: number; y: number; k: number };
const clamp = (val: number, min = 0, max = 1): number => Math.min(Math.max(val, min), max);

const infiniteExtent = [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
];

const translateExtent = infiniteExtent;
const defaultViewport = { x: 0, y: 0, zoom: 1 };

type Params = {
    refNode: RefObject<Element | null>;
    onZoom?: (currentTransform: ZoomTransform) => void;
};

const minZoom = 0.5;
const maxZoom = 3;

export const useZoom = ({ refNode, onZoom }: Params) => {
    const refIsZooming = useRef(false);

    const [zoomState, setZoomState] = useState<{
        d3Selection: ReturnType<typeof select> | null;
        d3ZoomInstance: ReturnType<typeof zoom> | null;
    }>({ d3Selection: null, d3ZoomInstance: null });

    // add zoom instance selection
    useEffect(() => {
        if (!refNode.current) return;
        const d3ZoomInstance = zoom()
            .scaleExtent([minZoom, maxZoom])
            .filter((event) => {
                // 只允许 wheel（滚轮缩放）和触摸缩放
                return event.type === 'wheel' || event.type === 'touchstart' || event.type === 'touchmove';
            });
        const selection = select(refNode.current as Element).call(d3ZoomInstance);
        const clampedX = clamp(defaultViewport.x, translateExtent[0][0], translateExtent[1][0]);
        const clampedY = clamp(defaultViewport.y, translateExtent[0][1], translateExtent[1][1]);
        const clampedZoom = clamp(defaultViewport.zoom, minZoom, maxZoom);
        const updatedTransform = zoomIdentity.translate(clampedX, clampedY).scale(clampedZoom);

        d3ZoomInstance.transform(selection, updatedTransform);
        setZoomState({
            d3Selection: selection,
            d3ZoomInstance,
        });
    }, [refNode, setZoomState]);

    // add d3 zoom listener
    useEffect(() => {
        const inst = zoomState.d3ZoomInstance;
        if (!inst) return;
        inst.on('start', (evt: D3ZoomEvent<HTMLDivElement, unknown>) => {
            // console.log('Zoom start event:', evt);
            if (!evt.sourceEvent) return;
            refIsZooming.current = true;
            // if (evt.sourceEvent?.type === 'mousedown') {
            //     setPaneDragging(true);
            // }
            // console.log('zoom start');
        })
            .on('zoom', (evt: D3ZoomEvent<HTMLDivElement, unknown>) => {
                const currentTransform: ZoomTransform = { ...evt.transform };
                // setTransform(currentTransform);
                onZoom?.(currentTransform);
                // console.log('zooming', currentTransform);
            })
            .on('end', (evt: D3ZoomEvent<HTMLDivElement, unknown>) => {
                if (!evt.sourceEvent) return;
                refIsZooming.current = false;
                // setPaneDragging(false);
                // console.log('zoom end');
            });
    }, [onZoom, zoomState.d3ZoomInstance]);
};
