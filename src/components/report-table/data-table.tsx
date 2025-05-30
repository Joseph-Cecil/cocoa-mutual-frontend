import { useState, useEffect, useRef } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import DataTableSearch, { FilterType } from "./data-table-search";
import { BasicDataTable } from "./basic-data-table";
import { fetchStaffData } from "@/api/userApi";
import { columns } from "./columns";
import { DatabaseSchema } from "types/report";
import { formatCurrency } from "@/utils/formatCurrency";

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
    description: `Contribution for ${month}`,
    monthly: typeof amount === "number" ? amount : 0,
    interestPaid: index === 11 ? interestPaid ?? 0 : 0,
    withdrawal: index === 11 ? withdrawal ?? 0 : 0,
    balanceAfterInterest: index === 11 ? balanceAfterInterest ?? 0 : 0,
  }));
}

export function DataTable() {
  const [tableData, setTableData] = useState<DatabaseSchema[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [staffName, setStaffName] = useState<string | null>(null);
  const [staffId, setStaffId] = useState<string | null>(null);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<FilterType[]>([]);

  const printRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchStaffData(); // API call
        const transformedData = transformApiDataToTableRows(data);
        setTableData(transformedData);
        setRowCount(transformedData.length);

        setStaffName(data.name || null);
        setStaffId(String(data.staffId) || null);
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

  const table = useReactTable({
    data: tableData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
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

const handlePrint = () => {
  if (printRef.current) {
    const printWindow = window.open("", "_blank");
    printWindow?.document.write(`
      <html>
        <head>
          <title>Print Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .totals p { margin: 4px 0; }

            /* Hide elements with class "no-print" during printing */
            .no-print { display: none !important; }
          </style>
        </head>
        <body>
          <h2>Contribution Report</h2>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  }
};


  const totals = tableData.reduce(
    (acc, row) => {
      acc.monthly += row.monthly || 0;
      acc.interestPaid += row.interestPaid || 0;
      acc.withdrawal += row.withdrawal || 0;
      acc.balanceAfterInterest = row.balanceAfterInterest || acc.balanceAfterInterest;
      return acc;
    },
    {
      monthly: 0,
      interestPaid: 0,
      withdrawal: 0,
      balanceAfterInterest: 0,
    }
  );

  return (
    <div>
      <div className="border-b">
        <div className="container mx-auto">
          <div className="py-1 mt-1">
            <h1 className="text-3xl font-semibold">Report Table</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2" />
              <div className="flex items-center space-x-2">
                <DataTableSearch onFiltersChange={handleFiltersChange} onPrint={handlePrint} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-10 space-y-6" ref={printRef}>
        {/* Staff Info */}
        {staffId && staffName && (
          <div className="text-lg font-semibold">
            Staff ID: {staffId} — Name: {staffName}
          </div>
        )}

        {/* Table */}
        <BasicDataTable
          table={table}
          isLoading={isLoading}
          showPagination={true}
        />

        {/* Totals */}
        {tableData.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded border text-sm text-gray-800">
<p><strong>Total Monthly Contributions:</strong> {formatCurrency(totals.monthly)}</p>
<p><strong>Total Interest Paid:</strong> {formatCurrency(totals.interestPaid)}</p>
<p><strong>Total Withdrawn:</strong> {formatCurrency(totals.withdrawal)}</p>
<p><strong>Final Balance After Interest:</strong> {formatCurrency(totals.balanceAfterInterest)}</p>

          </div>
        )}
      </div>
    </div>
  );
}
