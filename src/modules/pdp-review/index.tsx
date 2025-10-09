import '@annotorious/react/annotorious-react.css';
import { type FC } from 'react';
import { AnnoImage } from './components/AnnoImage';
import { PermissionGuard } from '@/components/PermissionGuard';
import { PermissionEnum } from '@/services/role/permissionEnum';

export const Main: FC = () => {
    return (
        <PermissionGuard permission={PermissionEnum.TASK_VIEW} showForbiddenWarning>
            <div className="flex flex-col">
                <h1>Annotorious React Example</h1>
                <p>
                    This is a simple example of using Annotorious with React. You can
                    annotate images and save the annotations.
                </p>
                <div className="flex">
                    <AnnoImage imageUrl="/IH4045-030/NIKE+GATO+BG.jpeg" />
                    <AnnoImage imageUrl="/IH4045-030/NIKE+GATO+BG.png" className="ml-4" />
                </div>
            </div>
        </PermissionGuard>
    );
};
