import type { FC, PropsWithChildren } from 'react';
import { createContext, useState } from 'react';

type ZoomTransform = { x: number; y: number; k: number };

const ZoomContext = createContext({} as {
    transform: ZoomTransform;
    setTransform: (transform: ZoomTransform) => void;
});

const ZoomStore: FC<PropsWithChildren> = ({ children }) => {
    const [transform, setTransform] = useState<ZoomTransform>({
        x: 0,
        y: 0,
        k: 1,
    });

    return <ZoomContext.Provider value={{ transform, setTransform }}>{children}</ZoomContext.Provider>;
};

export { ZoomStore, ZoomContext };
