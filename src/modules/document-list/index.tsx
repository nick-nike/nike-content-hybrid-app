import type {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useDebounceFn, useRequest, useTitle } from 'ahooks';
import axios from 'axios';
import { useCallback, useEffect, useState, type FC } from 'react';
import { SheetDemo } from './components/SheetDemo';
import { columns } from './services/columns';
import type { DocumentListItem, DocumentListResponse } from './services/types';
import { AppHeader } from '@/components/AppHeader';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export const Main: FC = () => {
    useTitle('ContentHub | Document List');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility]
        = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [entities, setEntities] = useState<DocumentListItem[]>([]);
    const [keyword, setKeyword] = useState('');

    const { data: pageData, loading, runAsync } = useRequest((pageIndex = 0, keyword = '') => {
        return axios.get<DocumentListResponse>(`https://ae1bzam443.execute-api.cn-northwest-1.amazonaws.com.cn/Stage/document?currentPageIndex=${pageIndex}&pageSize=100&ecm_fulltext=${keyword}`).then(res => res.data);
    }, { manual: true });

    const fetchNextPage = useCallback((clear?: boolean) => {
        const nextPageIndex = pageData && !clear ? pageData.currentPageIndex + 1 : 0;
        runAsync(nextPageIndex, keyword).then(data => {
            setEntities(prev => {
                return clear ? data.entries : [...prev, ...data.entries];
            });
        });
    }, [keyword, pageData, runAsync]);

    const { run: debouncedFetchNextPage } = useDebounceFn(fetchNextPage, { wait: 500 });

    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (loading || !containerRefElement) return;
            const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
            const curPageIndex = pageData?.currentPageIndex || 0;
            const totalPageCount = pageData?.pageCount || 0;
            if (
                scrollHeight - scrollTop - clientHeight < 500
                && curPageIndex < totalPageCount - 1
            ) {
                debouncedFetchNextPage();
            }
        },
        [loading, pageData?.currentPageIndex, pageData?.pageCount, debouncedFetchNextPage],
    );

    useEffect(() => {
        if (!pageData) {
            debouncedFetchNextPage();
        }
    }, [debouncedFetchNextPage, pageData]);

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

    return (
        <>
            <AppHeader
                title="Nuxeo Documents"
                onSearch={keyword => {
                    setKeyword(keyword);
                    if (keyword) {
                        debouncedFetchNextPage(true);
                    }
                }}
            >
                <div><SheetDemo /></div>
            </AppHeader>
            <div className="p-4">
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length}
                        {' '}
                        of
                        {' '}
                        {table.getFilteredRowModel().rows.length}
                        {' '}
                        row(s) selected.
                    </div>
                </div>
                <div className="h-[calc(100vh-160px)] overflow-auto rounded-md border" onScroll={e => fetchMoreOnBottomReached(e.currentTarget)}>
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
        </>
    );
};
