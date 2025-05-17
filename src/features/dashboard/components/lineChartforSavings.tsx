"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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

import { fetchStaffData } from "@/api/userApi" // Adjust the path based on your folder structure

const chartConfig = {
  monthly: {
    label: "Monthly Contribution",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function MonthlySavingsChart() {
const [chartData, setChartData] = useState<{ month: string; contribution: number }[]>([])

  useEffect(() => {
    const fetchData = async () => {
     try {
    const data = await fetchStaffData()
    const formattedData = Object.entries(data.monthly).map(([month, value]) => ({
      month,
      contribution: Number(value), // Cast to number here
    }))
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
        <CardTitle>Monthly Savings Contribution</CardTitle>
        <CardDescription>Contributions for 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(3)}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="contribution"
              type="monotone"
              stroke="var(--color-monthly)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-monthly)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing contributions for the year 2024
        </div>
      </CardFooter>
    </Card>
  )
}
