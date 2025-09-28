
"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent } from "../ui/card";

const data = [
  { name: "Jan", total: 0 },
  { name: "Feb", total: 20 },
  { name: "Mar", total: 40 },
  { name: "Apr", total: 30 },
  { name: "May", total: 50 },
  { name: "Jun", total: 45 },
  { name: "Jul", total: 60 },
  { name: "Aug", total: 70 },
  { name: "Sep", total: 85 },
  { name: "Oct", total: 95 },
  { name: "Nov", total: 80 },
  { name: "Dec", total: 100 },
];

const investmentData = [
  { name: "Jan", total: 0 },
  { name: "Feb", total: 15 },
  { name: "Mar", total: 20 },
  { name: "Apr", total: 25 },
  { name: "May", total: 35 },
  { name: "Jun", total: 40 },
  { name: "Jul", total: 38 },
  { name: "Aug", total: 42 },
  { name: "Sep", total: 48 },
  { name: "Oct", total: 55 },
  { name: "Nov", total: 50 },
  { name: "Dec", total: 60 },
];

const buildAndHoldData = [
  { name: "Jan", total: 0 },
  { name: "Feb", total: 10 },
  { name: "Mar", total: 15 },
  { name: "Apr", total: 20 },
  { name: "May", total: 18 },
  { name: "Jun", total: 25 },
  { name: "Jul", total: 30 },
  { name: "Aug", total: 28 },
  { name: "Sep", total: 35 },
  { name: "Oct", total: 40 },
  { name: "Nov", total: 38 },
  { name: "Dec", total: 45 },
];


const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="shadow-lg">
          <CardContent className="p-3 text-center">
            <p className="text-sm font-bold">{payload[0].value}</p>
            <p className="text-xs text-muted-foreground">+12%</p>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

export function RevenueChart() {
  return (
    <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{
                top: 5,
                right: 40,
                left: -20,
                bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                <YAxis tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Line type="monotone" dataKey="total" stroke="#f43f5e" strokeWidth={3} dot={false} name="Development" />
                <Line type="monotone" data={investmentData} dataKey="total" stroke="#d1d5db" strokeWidth={3} dot={false} name="Investment" />
                <Line type="monotone" data={buildAndHoldData} dataKey="total" stroke="#d1d5db" strokeWidth={3} dot={false} name="Build and Hold" />
            </LineChart>
        </ResponsiveContainer>
        <div className="absolute top-16 right-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#f43f5e]"></span>
                <span className="text-xs">Development</span>
            </div>
             <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#d1d5db]"></span>
                <span className="text-xs">Investment</span>
            </div>
             <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#d1d5db]"></span>
                <span className="text-xs">Build and Hold</span>
            </div>
        </div>
    </div>
  )
}
