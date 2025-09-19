
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Card, CardContent } from "../ui/card";

const chartData = [
  { month: "1 Oct", desktop: 309.20 },
  { month: "9 Oct", desktop: 200.00 },
  { month: "16 Oct", desktop: 587.12 },
  { month: "23 Oct", desktop: 499.80 },
  { month: "31 Oct", desktop: 350.00 },
  { month: "1 Nov", desktop: 30.19 },
  { month: "6 Nov", desktop: 467.89 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const platformData = [
    { name: 'Shopee', value: '200.9k', change: '12.9%', changeType: 'decrease' },
    { name: 'Tokopedia', value: '90.12k', change: '80.9%', changeType: 'increase' },
    { name: 'Amazon', value: '65.74k', change: '71.66%', changeType: 'increase' },
    { name: 'Lazada', value: '55.12k', change: '10.9%', changeType: 'decrease' }
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-muted-foreground">Platforms view distribution</p>
            <p className="text-xs text-muted-foreground mb-2">NOV 29, 2023</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div><span className="text-primary font-semibold mr-1">■</span>Shopee</div>
                <div className="text-right">55.9%</div>
                <div><span className="text-green-500 font-semibold mr-1">■</span>Tokopedia</div>
                <div className="text-right">15.71%</div>
                 <div><span className="text-blue-500 font-semibold mr-1">■</span>Amazon</div>
                <div className="text-right">12.18%</div>
                <div><span className="text-red-500 font-semibold mr-1">■</span>Lazada</div>
                <div className="text-right">16.21%</div>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

export function PlatformChart() {
  return (
    <div className="h-[350px] w-full">
        <div className="flex items-center gap-4 px-6 pb-4">
            {platformData.map(p => (
                <div key={p.name}>
                    <p className="text-xs text-muted-foreground">{p.name}</p>
                    <p className="text-lg font-semibold">{p.value}</p>
                </div>
            ))}
        </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickCount={7}
            tickFormatter={(value) => `${value / 100}k`}
          />
          <Tooltip cursor={{fill: 'hsla(var(--primary) / 0.1)'}} content={<CustomTooltip />} />
          <Bar dataKey="desktop" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 2 ? 'hsl(var(--primary))' : 'hsla(var(--primary) / 0.3)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
