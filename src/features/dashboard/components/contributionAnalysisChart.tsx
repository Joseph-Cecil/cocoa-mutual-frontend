"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
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
  openingBalance: {
    label: "Opening Balance",
    color: "hsl(var(--chart-1))",
  },
  totalContributions: {
    label: "Total Contributions",
    color: "hsl(var(--chart-2))",
  },
  interestPaid: {
    label: "Interest Paid",
    color: "hsl(var(--chart-3))",
  },
  withdrawals: {
    label: "Withdrawals",
    color: "hsl(var(--chart-4))",
  },
  balanceAfterInterest: {
    label: "Balance After Interest",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function ContributionAnalysisChart() {
  const [chartData, setChartData] = useState<{category:string; amount: number; fill: string}[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStaffData()

        const formattedData = [
          { category: "Opening Balance", amount: data.openingBalance, fill: "#4CAF50" },
          { category: "Total Contributions", amount: data.totalContributions, fill: "#FF9800" },
          { category: "Interest Paid", amount: data.totalInterest, fill: "#F44336" },
          { category: "Withdrawals", amount: data.totalWithdrawals, fill: "#4CAF50" },
          { category: "Balance After Interest", amount: data.carryForwardBalance, fill: "#2196F3" },
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
    <Card>
      <CardHeader>
        <CardTitle>Contribution Analysis (Bar Chart)</CardTitle>
        <CardDescription>Comparing different aspects of financials</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="amount"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey="category"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="amount"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this year <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Contribution analysis for financial insights
        </div>
      </CardFooter>
    </Card>
  )
}
