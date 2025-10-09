import { useMemo, type FC, type PropsWithChildren } from 'react';
import type { PermissionEnum } from '@/services/role/permissionEnum';
import { useUserInfo } from '@/services/user/useUserInfo';

type Props = {
    permission: PermissionEnum;
    showForbiddenWarning?: boolean;
};

const PermissionGuard: FC<PropsWithChildren<Props>> = ({ children, permission, showForbiddenWarning }) => {
    const { userInfo: { roles } } = useUserInfo();

    const hasPermission = useMemo(() => {
        return roles.some(role => {
            const permissions = role?.permissions || [];
            return permissions.includes(permission);
        });
    }, [roles, permission]);

    if (hasPermission) {
        return children;
    }

    return showForbiddenWarning ? <div>You do not have permission to access this content.</div> : null;
};

export { PermissionGuard };
