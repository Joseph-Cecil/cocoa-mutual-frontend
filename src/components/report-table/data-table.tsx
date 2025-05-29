import { useState, useEffect, useRef } from "react";
import { getCoreRowModel, getPaginationRowModel, PaginationState, useReactTable } from "@tanstack/react-table";
import DataTableSearch, { FilterType } from "./data-table-search";
import { BasicDataTable } from "./basic-data-table";
import { getStaffData } from "../../api/adminApi";
import { columns } from "./columns";
import { DatabaseSchema } from "types/report";
import { fetchStaffData } from "@/api/userApi";

const monthMap: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

function transformApiDataToTableRows(apiData: any): DatabaseSchema[] {
  const {
    staffId,
    monthly,
    interestPaid,
    withdrawal,
    balanceAfterInterest,
    year,
  } = apiData;

  if (!monthly || typeof monthly !== "object") return [];

  return Object.entries(monthly).map(([month, amount], index) => ({
    id: `${staffId}-${month}`,
    userId: String(staffId),
    date: `${year}-${monthMap[month] ?? "01"}-01`,
    description: `Monthly contribution for ${month}`,
    monthly: typeof amount === "number" ? amount : 0,
    interestPaid: index === 11 ? interestPaid ?? 0 : 0,
    withdrawal: index === 11 ? withdrawal ?? 0 : 0,
    balanceAfterInterest: index === 11 ? balanceAfterInterest ?? 0 : 0,
  }));
}

export function DataTable() {
  const [tableData, setTableData] = useState<DatabaseSchema[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Loading state for future enhancements
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<FilterType[]>([]);

  // Ref to access the table's print functionality
  const printRef = useRef<HTMLTableElement>(null);

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStaffData(); // your actual API call
      const transformedData = transformApiDataToTableRows(data);
      setTableData(transformedData);
      setRowCount(transformedData.length);
    } catch (error) {
      console.error("Failed to fetch staff data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);


const handleFiltersChange = (newFilters: FilterType[]) => {
  setFilters(newFilters);
  setPagination({ pageIndex: 0, pageSize });

  const filteredData = tableData.filter((item) => {
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
