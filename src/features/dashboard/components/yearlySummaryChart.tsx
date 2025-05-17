"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import { useEffect, useState } from "react"
import { fetchStaffData } from "@/api/userApi"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  contributions: {
    label: "Contributions",
    color: "hsl(var(--chart-1))",
  },
  interest: {
    label: "Interest",
    color: "hsl(var(--chart-2))",
  },
  withdrawals: {
    label: "Withdrawals",
    color: "hsl(var(--chart-3))",
  },
  carryForward: {
    label: "Carry Forward",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function YearlySummaryChart() {
  const [chartData, setChartData] = useState<{value: unknown; name: string; fill: string}[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStaffData()
        const totalContributions = data.totalContributions || 0
        const totalInterest = data.totalInterest || 0
        const withdrawals = data.withdrawal || 0
        const carryForwardBalance = data.carryForwardBalance || 0

        const formattedData = [
          { name: "Contributions", value: totalContributions, fill: "#4CAF50" },
          { name: "Interest Paid", value: totalInterest, fill: "#FF9800" },
          { name: "Withdrawals", value: withdrawals, fill: "#F44336" },
          { name: "Carry Forward", value: carryForwardBalance, fill: "#2196F3" },
        ]

        setChartData(formattedData)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Yearly Summary</CardTitle>
        <CardDescription>Visual breakdown of money distribution for 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 mt-10 pb-0">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="value" label nameKey="name" />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="text-center text-muted-foreground">Data unavailable or 0 for all categories</div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this year <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing a breakdown of Contributions, Interest Paid, Withdrawals, and Carry Forward.
        </div>
      </CardFooter>
    </Card>
  )
}
