import { useContext, useRef, type FC, type PropsWithChildren } from 'react';
import { ZoomContext } from './components/ZoomStore';
import { useZoom } from './services/useZoom';
import { cn } from '@/lib/utils';

const ZoomPane: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
    const { setTransform } = useContext(ZoomContext);
    const refNode = useRef<HTMLDivElement>(null);

    useZoom({ refNode, onZoom: setTransform });

    return <div ref={refNode} className={cn('size-full relative overflow-hidden', className)}>{children}</div>;
};

export { ZoomPane };
