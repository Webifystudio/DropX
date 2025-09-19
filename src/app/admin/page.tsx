
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { PlatformChart } from '@/components/admin/platform-chart';
import { RevenueChart } from '@/components/admin/revenue-chart';

const overviewData = [
    { title: 'Product viewed', value: '411.9K', change: '2.6%', changeType: 'increase', vs: '313.2k' },
    { title: 'Product shared', value: '230.4K', change: '13.3%', changeType: 'increase', vs: '215.4k' },
    { title: 'Product added to cart', value: '20.9K', change: '4.3%', changeType: 'increase', vs: '29.7k' },
    { title: 'Product checked out', value: '410.54K', change: '30.22%', changeType: 'decrease', vs: '' },
];

export default function AdminDashboard() {

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {overviewData.map((item, index) => (
                <Card key={item.title} className={index === 0 ? 'bg-primary text-primary-foreground' : ''}>
                    <CardHeader className="pb-2">
                         <div className="flex justify-between items-center text-sm font-medium">
                            <span>{item.title}</span>
                            <div className={`flex items-center ${index === 0 ? '' : 'text-green-500'}`}>
                                {item.changeType === 'increase' ? <ArrowUp className="h-4 w-4"/> : <ArrowDown className="h-4 w-4 text-red-500"/>}
                                <span className={item.changeType === 'decrease' ? 'text-red-500' : ''}>{item.change}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-baseline">
                            <div className="text-4xl font-bold">{item.value}</div>
                             {item.vs && <div className={`text-sm ${index === 0 ? 'opacity-75' : 'text-muted-foreground'}`}>vs. {item.vs}</div>}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Platform view</CardTitle>
                    <button className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/90">
                        <Plus className="h-4 w-4" />
                        Add platforms
                    </button>
                </CardHeader>
                <CardContent className="pl-2">
                    <PlatformChart />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total revenue</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <RevenueChart />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
