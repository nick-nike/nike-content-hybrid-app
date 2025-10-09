import { RoleEnums } from '@/services/role/roleEnums';

type UserEntity = {
    id: string;
    email: string;
    name: string;
    roles: string[];
    isActive: boolean;
};

const mockUserEntities: UserEntity[] = [
    {
        id: '1',
        email: 'john.doe@example.com',
        name: 'John Doe',
        roles: [RoleEnums.NORMAL_USER],
        isActive: true,
    },
    {
        id: '2',
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        roles: [RoleEnums.ADMINISTRATOR],
        isActive: false,
    },
    {
        id: '3',
        email: 'alice.johnson@example.com',
        name: 'Alice Johnson',
        roles: [RoleEnums.ASSET_REVIEWER, RoleEnums.ASSET_PRODUCER],
        isActive: true,
    },
    {
        id: '4',
        email: 'bob.brown@example.com',
        name: 'Bob Brown',
        roles: [RoleEnums.ADMINISTRATOR, RoleEnums.NORMAL_USER],
        isActive: true,
    },
    {
        id: '5',
        email: 'charlie.white@example.com',
        name: 'Charlie White',
        roles: [RoleEnums.ASSET_PRODUCER],
        isActive: false,
    },
    {
        id: '6',
        email: 'david.miller@example.com',
        name: 'David Miller',
        roles: [RoleEnums.ADMINISTRATOR],
        isActive: true,
    },
    {
        id: '7',
        email: 'emma.wilson@example.com',
        name: 'Emma Wilson',
        roles: [RoleEnums.ASSET_PRODUCER, RoleEnums.NORMAL_USER],
        isActive: true,
    },
    {
        id: '8',
        email: 'frank.thomas@example.com',
        name: 'Frank Thomas',
        roles: [RoleEnums.NORMAL_USER],
        isActive: false,
    },
    {
        id: '9',
        email: 'grace.lee@example.com',
        name: 'Grace Lee',
        roles: [RoleEnums.ASSET_PRODUCER],
        isActive: true,
    },
    {
        id: '10',
        email: 'henry.garcia@example.com',
        name: 'Henry Garcia',
        roles: [RoleEnums.ADMINISTRATOR, RoleEnums.ASSET_PRODUCER],
        isActive: true,
    },
    {
        id: '11',
        email: 'isabella.chen@example.com',
        name: 'Isabella Chen',
        roles: [RoleEnums.NORMAL_USER],
        isActive: false,
    },
    {
        id: '12',
        email: 'jack.robinson@example.com',
        name: 'Jack Robinson',
        roles: [RoleEnums.ASSET_PRODUCER],
        isActive: true,
    },
    {
        id: '13',
        email: 'karen.davis@example.com',
        name: 'Karen Davis',
        roles: [RoleEnums.ADMINISTRATOR],
        isActive: true,
    },
    {
        id: '14',
        email: 'lucas.martinez@example.com',
        name: 'Lucas Martinez',
        roles: [RoleEnums.ASSET_PRODUCER, RoleEnums.NORMAL_USER],
        isActive: false,
    },
    {
        id: '15',
        email: 'megan.taylor@example.com',
        name: 'Megan Taylor',
        roles: [RoleEnums.NORMAL_USER],
        isActive: true,
    },
    {
        id: '16',
        email: 'nathan.anderson@example.com',
        name: 'Nathan Anderson',
        roles: [RoleEnums.ADMINISTRATOR, RoleEnums.ASSET_PRODUCER],
        isActive: true,
    },
    {
        id: '17',
        email: 'olivia.jackson@example.com',
        name: 'Olivia Jackson',
        roles: [RoleEnums.ASSET_PRODUCER],
        isActive: false,
    },
    {
        id: '18',
        email: 'peter.harris@example.com',
        name: 'Peter Harris',
        roles: [RoleEnums.NORMAL_USER],
        isActive: true,
    },
    {
        id: '19',
        email: 'quinn.murphy@example.com',
        name: 'Quinn Murphy',
        roles: [RoleEnums.ADMINISTRATOR],
        isActive: true,
    },
    {
        id: '20',
        email: 'rachel.kim@example.com',
        name: 'Rachel Kim',
        roles: [RoleEnums.ASSET_PRODUCER, RoleEnums.NORMAL_USER],
        isActive: false,
    },
];

export { mockUserEntities, UserEntity };
