import { useContext, type FC, type PropsWithChildren } from 'react';
import { ZoomContext } from '../ZoomStore';

const ViewPane: FC<PropsWithChildren> = ({ children }) => {
    const { transform } = useContext(ZoomContext);
    return (
        <div
            style={{
                width: transform.k * 100 + '%', height: transform.k * 100 + '%',
                transformOrigin: '0 0',
            }}
        >
            {children}
        </div>
    );
};
export { ViewPane };
