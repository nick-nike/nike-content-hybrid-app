import { PermissionEnum } from './permissionEnum';

enum RoleEnums {
    NORMAL_USER = 'NORMAL_USER',
    ASSET_REVIEWER = 'ASSET_REVIEWER',
    ASSET_PRODUCER = 'ASSET_PRODUCER',
    ADMINISTRATOR = 'ADMINISTRATOR',
}

type RoleInfo = {
    id: RoleEnums;
    label: string;
    permissions: PermissionEnum[];
};

const roleMap: Record<RoleEnums, RoleInfo> = {
    [RoleEnums.NORMAL_USER]: {
        id: RoleEnums.NORMAL_USER,
        label: 'Normal User',
        permissions: [PermissionEnum.ASSET_VIEW],
    },
    [RoleEnums.ASSET_REVIEWER]: {
        id: RoleEnums.ASSET_REVIEWER,
        label: 'Asset Reviewer',
        permissions: [
            PermissionEnum.ASSET_VIEW,
            PermissionEnum.TASK_VIEW, PermissionEnum.TASK_EDIT,
            PermissionEnum.DISTRIBUTION_VIEW, PermissionEnum.DISTRIBUTION_EDIT,
        ],
    },
    [RoleEnums.ASSET_PRODUCER]: {
        id: RoleEnums.ASSET_PRODUCER,
        label: 'Asset Producer',
        permissions: [
            PermissionEnum.ASSET_VIEW, PermissionEnum.ASSET_EDIT,
            PermissionEnum.DISTRIBUTION_VIEW, PermissionEnum.DISTRIBUTION_EDIT,
        ],
    },
    [RoleEnums.ADMINISTRATOR]: {
        id: RoleEnums.ADMINISTRATOR,
        label: 'Administrator',
        permissions: Object.values(PermissionEnum),
    },
};

export { RoleEnums, roleMap, RoleInfo };
