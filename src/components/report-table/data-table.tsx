import { useState, useEffect, useRef } from "react";
import { getCoreRowModel, getPaginationRowModel, PaginationState, useReactTable } from "@tanstack/react-table";
import { staticData } from "./data"; // Import static data from `data.ts`
import DataTableSearch, { FilterType } from "./data-table-search";
import { BasicDataTable } from "./basic-data-table";
import { columns } from "./columns";

export function DataTable() {
  const [tableData, setTableData] = useState(staticData); // Initialize with static data
  const [rowCount, setRowCount] = useState(staticData.length); // Total rows from static data
  const [isLoading, setIsLoading] = useState(false); // Loading state for future enhancements
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<FilterType[]>([]);

  // Ref to access the table's print functionality
  const printRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    // Simulate fetching static data (could be replaced with actual API fetch if needed)
    setIsLoading(true);
    setTimeout(() => {
      setTableData(staticData); // Set data from static source
      setRowCount(staticData.length); // Update row count
      setIsLoading(false);
    }, 500); // Simulated delay
  }, []);

  // Filter static data locally
  const handleFiltersChange = (newFilters: FilterType[]) => {
    setFilters(newFilters);
    setPagination({ pageIndex: 0, pageSize }); // Reset pagination

    const filteredData = staticData.filter((item) => {
      return newFilters.every((filter) => {
        const value = item[filter.field as keyof typeof item];
        switch (filter.operator) {
          case "contains":
            return String(value).toLowerCase().includes(filter.value.toLowerCase());
          case "equals":
            return String(value).toLowerCase() === filter.value.toLowerCase();
          case "startsWith":
            return String(value).toLowerCase().startsWith(filter.value.toLowerCase());
          case "endsWith":
            return String(value).toLowerCase().endsWith(filter.value.toLowerCase());
          case "before":
            return new Date(value as string) < new Date(filter.value);
          case "after":
            return new Date(value as string) > new Date(filter.value);
          default:
            return true;
        }
      });
    });

    setTableData(filteredData);
  };

  // Table data and columns
  const table = useReactTable({
    data: tableData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize), // Paginate the filtered data
    columns,
    pageCount: Math.ceil(rowCount / pageSize),
    state: {
      pagination: { pageIndex, pageSize },
      globalFilter: filters,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  // Print function to be called from the DataTableSearch
  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank");
      printWindow?.document.write(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h2>Print Report</h2>
            ${printRef.current.outerHTML}
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print(); // Trigger the print dialog
    }
  };

  return (
    <div>
      <div className="border-b">
        <div className="container mx-auto">
          <div className="py-1 mt-1">
            <h1 className="text-3xl font-semibold">Report Table</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2"></div>
              <div className="flex items-center space-x-2">
                <DataTableSearch onFiltersChange={handleFiltersChange} onPrint={handlePrint} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-10">
        <BasicDataTable table={table} isLoading={isLoading} showPagination={true} ref={printRef} />
      </div>
    </div>
  );
}
