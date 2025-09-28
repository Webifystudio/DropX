
"use client"

import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts"
import { Card, CardContent } from "../ui/card";

const data = [
  { name: "OLD", value: 18600000, color: "#f87171" },
  { name: "SA", value: 3900000, color: "#fb923c" },
  { name: "WA", value: 3200000, color: "#34d399" },
  { name: "VIC", value: 0, color: "#a5b4fc" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-3">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-lg font-bold text-primary">
            ${(payload[0].value / 1000000).toFixed(1)}M
          </p>
        </CardContent>
      </Card>
    );
  }
  return null;
};

export function PlatformChart() {
  return (
    <div className="h-[350px] w-full flex items-center">
      <div className="w-1/2 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
         <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-3xl font-bold">$25.5M</p>
            <p className="text-sm text-muted-foreground">Total Amount</p>
         </div>
      </div>
      <div className="w-1/2 pr-6 flex flex-col justify-center space-y-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span>{entry.name}</span>
            </div>
            <span className="font-semibold">${(entry.value / 1000000).toFixed(1)}M</span>
          </div>
        ))}
      </div>
    </div>
  )
}
