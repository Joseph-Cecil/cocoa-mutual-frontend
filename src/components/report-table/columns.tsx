import {ColumnDef} from "@tanstack/react-table"
import {DatabaseSchema} from "../../../types/report"

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
    },
    {
        accessorKey: "interestPaid",
        header: "Interest Paid",
    },
    {
        accessorKey: "withdrawal",
        header: "Withdrawal",
    },
    {
        accessorKey: "balanceAfterInterest",
        header: "Balance"
    },
]