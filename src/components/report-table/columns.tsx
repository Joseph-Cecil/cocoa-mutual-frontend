import {ColumnDef} from "@tanstack/react-table"
import {DatabaseSchema} from "../../../types/report"

export const columns: ColumnDef<DatabaseSchema>[] = [
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({row}) => {
            const date = new Date(row.getValue("date"))
            return <div>{date.toLocaleDateString()}</div>
        },
    },
]