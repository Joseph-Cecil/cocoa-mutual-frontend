"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { fetchStaffData } from "@/api/userApi"

type SavingsData = {
  month: string
  cumulativeBalance: number
}

const chartConfig = {
  cumulativeBalance: {
    label: "Cumulative Balance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function CumulativeSavingsProjection() {
  const [chartData, setChartData] = React.useState<SavingsData[]>([])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStaffData()
        const monthlyContributions = Object.values(data.monthly)
        const months = Object.keys(data.monthly)

        const chartData: SavingsData[] = []
        let cumulativeBalance = data.openingBalance

        for (let i = 0; i < months.length; i++) {
          cumulativeBalance += monthlyContributions[i] || 0
          chartData.push({
            month: months[i],
            cumulativeBalance: parseFloat(cumulativeBalance.toFixed(2)),
          })
        }

        if (chartData.length > 0) {
          chartData[chartData.length - 1].cumulativeBalance = parseFloat(
            data.balanceAfterInterest.toFixed(2)
          )
        }

        setChartData(chartData)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative Savings Projection (Area Chart)</CardTitle>
<CardDescription>
          This chart represents how your savings grow throughout the year. The shaded area shows the
          total balance over time, starting from your opening balance, adding monthly contributions,
          and including any interest earned. The final point displays your balance after interest for the year.
        </CardDescription>      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="cumulativeBalance"
              stroke="#1E3A8A"
              fillOpacity={1}
              fill="url(#colorSavings)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
