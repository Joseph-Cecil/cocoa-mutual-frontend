"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
  projection: {
    label: "Projected Savings",
    color: "hsl(var(--chart-1))",
  },
  interest: {
    label: "Projected Interest",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function SavingsProjectionChart() {
  const [chartData, setChartData] = useState<{month:string; projection:number; interest: number }[]>([])

  useEffect(() => {
    const fetchData = async () => {
 try {
        const data = await fetchStaffData()
        const carryForward = data.carryForwardBalance
        const formattedData = Array.from({ length: 12 }, (_, index) => {
          const month = new Date(2025, index).toLocaleString("default", { month: "short" })
          const projection = parseFloat((carryForward * Math.pow(1.05, index + 1)).toFixed(2))
          const interest = parseFloat((projection - carryForward).toFixed(2))
          return {
            month,
            projection,
            interest,
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
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>Projected Savings & Interest for 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="projection" fill="var(--color-projection)" radius={4} />
            <Bar dataKey="interest" fill="var(--color-interest)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Projections for next year <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Expected savings growth and interest for 2025
        </div>
      </CardFooter>
    </Card>
  )
}
