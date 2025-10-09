import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { TableFilter } from '@/components/TableFilter';
import { Button } from '@/components/ui/button';
import { roleMap } from '@/services/role/roleEnums';

type Props<TData> = {
    table: Table<TData>;
};

const rolesOptions = Object.values(roleMap).map((role) => ({
    value: `${role.id}`,
    label: role.label,
    icon: undefined,
}));

const statusOptions = [
    { label: 'Enabled', value: true, icon: undefined },
    { label: 'Disabled', value: false, icon: undefined },
];

const TableToolbar = <TData,>({ table }: Props<TData>) => {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {table.getColumn('roles') && (
                    <TableFilter
                        column={table.getColumn('roles')}
                        title="Roles"
                        options={rolesOptions}
                    />
                )}
                {table.getColumn('isActive') && (
                    <TableFilter
                        column={table.getColumn('isActive')}
                        title="Status"
                        options={statusOptions}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X />
                    </Button>
                )}
            </div>
        </div>
    );
};

export { TableToolbar };
