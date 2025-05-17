"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

import { fetchStaffData } from "@/api/userApi"

const chartConfig = {
  savingsGrowth: {
    label: "Savings Growth",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function SavingsGrowthChart() {
  const [chartData, setChartData] = useState<{ month: string; growth: number }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStaffData()
        let cumulativeSum = 0
        const formattedData = Object.entries(data.monthly).map(([month, value]) => {
          cumulativeSum += Number(value)
          return {
            month,
            growth: cumulativeSum,
          }
        })
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
        <CardTitle>Savings Growth Over Time</CardTitle>
        <CardDescription>Accumulated savings for 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
            }}
          >
            <defs>
              <linearGradient id="fillGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-savingsGrowth)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-savingsGrowth)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(3)}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="growth"
              type="monotone"
              fill="url(#fillGrowth)"
              fillOpacity={0.4}
              stroke="var(--color-savingsGrowth)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Accumulated Savings for the year 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
