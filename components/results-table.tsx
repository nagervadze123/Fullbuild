'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { type ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { toggleSave } from '@/lib/actions/niche-actions';

export type ResultRow = {
  id: string;
  title: string;
  audience: string;
  category: string;
  scoreTotal: number;
  isSaved: boolean;
};

export function ResultsTable({ data }: { data: ResultRow[] }) {
  const [rows, setRows] = useState(data);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isPending, startTransition] = useTransition();
  const columns = useMemo<ColumnDef<ResultRow>[]>(() => [
    { accessorKey: 'title', header: 'Title', cell: ({ row }) => <Link className="underline" href={`/niche/${row.original.id}`}>{row.original.title}</Link> },
    { accessorKey: 'audience', header: 'Audience' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'scoreTotal', header: 'Score' },
    {
      id: 'save',
      header: 'Save',
      cell: ({ row }) => (
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => startTransition(async () => {
            const next = !row.original.isSaved;
            await toggleSave({ nicheId: row.original.id, isSaved: next });
            setRows((prev) => prev.map((x) => x.id === row.original.id ? { ...x, isSaved: next } : x));
          })}
        >
          {row.original.isSaved ? 'Unsave' : 'Save'}
        </Button>
      )
    }
  ], [isPending]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
    <div className="space-y-2">
      <input className="w-full max-w-sm rounded-md border px-3 py-2 text-sm" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search table" />
      <table className="w-full text-sm">
        <thead className="bg-slate-100">{table.getHeaderGroups().map((hg) => <tr key={hg.id}>{hg.headers.map((h) => <th key={h.id} className="p-2 text-left">{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>)}</thead>
        <tbody>{table.getRowModel().rows.map((r) => <tr key={r.id} className="border-t">{r.getVisibleCells().map((c) => <td key={c.id} className="p-2">{flexRender(c.column.columnDef.cell, c.getContext())}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
