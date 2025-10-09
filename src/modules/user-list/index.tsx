import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useTitle } from 'ahooks';
import { useCallback, useState, type FC } from 'react';
import { TableToolbar } from './components/TableToolbar';
import { columns } from './services/columns';
import type { UserEntity } from './services/userType';
import { mockUserEntities } from './services/userType';
import { AppHeader } from '@/components/AppHeader';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PermissionEnum } from '@/services/role/permissionEnum';

const Main: FC = () => {
    useTitle('ContentHub | Users');

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility]
        = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [entities] = useState<UserEntity[]>(mockUserEntities);

    const table = useReactTable({
        data: entities,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const fetchMoreOnBottomReached = useCallback(() => {
        //
    }, []);

    return (
        <PermissionGuard permission={PermissionEnum.USER_VIEW} showForbiddenWarning>
            <AppHeader
                title="Users"
                onChange={keyword => {
                    table.getColumn('email')?.setFilterValue(keyword);
                }}
            />
            <div className="flex flex-col gap-2 p-4">
                <TableToolbar table={table} />
                <div className="h-[calc(100vh-150px)] overflow-auto rounded-md border bg-white p-4" onScroll={e => fetchMoreOnBottomReached()}>
                    <Table>
                        <TableHeader className="z-10 bg-white">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext(),
                                                        )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length
                                ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && 'selected'}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    )
                                : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </PermissionGuard>
    );
};

export { Main };
