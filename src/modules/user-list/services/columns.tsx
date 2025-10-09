import type { ColumnDef } from '@tanstack/react-table';
import { UserEditor } from '../components/UserEditor';
import type { UserEntity } from './userType';
import { StatusLabel } from '@/components/StatusLabel';
import { UserAvatar } from '@/components/UserAvatar';
import type { RoleEnums } from '@/services/role/roleEnums';
import { roleMap } from '@/services/role/roleEnums';

const columns: ColumnDef<UserEntity>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            const userName = row.getValue<string>('name');
            return (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <UserAvatar userName={userName} />
                        {userName}
                    </div>
                    <UserEditor userInfo={row.original} />
                </div>
            );
        },
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => row.getValue('email'),
    },
    {
        accessorKey: 'roles',
        header: 'Role',
        cell: ({ row }) => {
            const roles = row.getValue<RoleEnums[]>('roles');
            return roles.map(role => {
                return roleMap[role]?.label || '';
            }).join(' / ');
        },
        filterFn: 'arrIncludesSome',
    },
    {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.getValue<boolean>('isActive');
            return <StatusLabel enabled={isActive} />;
        },
        filterFn: (row, columnId, filterValue) => {
            return filterValue.includes(row.getValue(columnId));
        },
    },
];

export { columns };
