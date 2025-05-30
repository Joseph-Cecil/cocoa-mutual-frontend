// columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { DatabaseSchema } from "types/report";
import { formatCurrency } from "@/utils/formatCurrency"; // Update path if needed

export const columns: ColumnDef<DatabaseSchema>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "monthly",
    header: "Monthly Contribution",
    cell: ({ getValue }) => <div className="text-right">{formatCurrency(getValue() as number)}</div>,
  },
  {
    accessorKey: "interestPaid",
    header: "Interest Paid",
    cell: ({ getValue }) => <div className="text-right">{formatCurrency(getValue() as number)}</div>,
  },
  {
    accessorKey: "withdrawal",
    header: "Withdrawal",
    cell: ({ getValue }) => <div className="text-right">{formatCurrency(getValue() as number)}</div>,
  },
  {
    accessorKey: "balanceAfterInterest",
    header: "Balance After Interest",
    cell: ({ getValue }) => <div className="text-right">{formatCurrency(getValue() as number)}</div>,
  },
];
