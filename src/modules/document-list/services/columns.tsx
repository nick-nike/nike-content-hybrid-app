import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DocumentListItem } from './types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<DocumentListItem>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected()
                    || (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
            <Link className="underline" to={`/document/${row.original.uid}`}>{row.getValue('title')}</Link>
        ),
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
            row.getValue('type')
        ),
    },
    {
        accessorKey: 'lastModified',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Modified
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            const formattedDate = dayjs(row.getValue('lastModified')).format('YYYY-MM-DD');
            return <div className="lowercase">{formattedDate}</div>;
        },
    },
];
