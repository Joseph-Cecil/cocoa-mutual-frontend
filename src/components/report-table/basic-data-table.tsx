// basic-data-table.tsx

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePagination } from "./data-table-pagination";
import React, { forwardRef } from "react";

// Update the ref type to React.Ref<HTMLTableElement>
interface ReusableTableProps<TData> {
    table: ReactTable<TData>;
    isLoading: boolean;
    showPagination: boolean;
    ref: React.Ref<HTMLTableElement>; // Change this line to accept a React.Ref
}

// Forward the ref to the table element
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BasicDataTable = forwardRef<HTMLTableElement, ReusableTableProps<any>>(
  ({ table, isLoading, showPagination }, ref) => {
    return (
      <div>
        <div className="rounded-md border">
          <Table ref={ref}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: table.getState().pagination.pageSize }).map((_, index) => (
                  <TableRow key={index}>
                    {table.getAllColumns().map((_column, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                    Keine Ergebnisse
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {showPagination && <DataTablePagination table={table} />}
        </div>
      </div>
    );
  }
);

BasicDataTable.displayName = "BasicDataTable"; // Add display name for debugging

export { BasicDataTable };
