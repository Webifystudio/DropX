

'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, where, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, ShoppingBag, ArrowUp, ArrowDown, MoreHorizontal, Calendar } from 'lucide-react';
import { RevenueChart } from '@/components/admin/revenue-chart';
import { PlatformChart } from '@/components/admin/platform-chart';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "orders"), where("status", "==", "Delivered"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let revenue = 0;
      let profit = 0;
      let orders = 0;
      let monthly = 0;
      const currentMonth = new Date().getMonth();

      querySnapshot.forEach((doc) => {
        const order = doc.data() as Order;
        revenue += order.total;
        profit += order.profit || 0;
        orders++;

        if (new Date(order.date.seconds * 1000).getMonth() === currentMonth) {
            monthly += order.total;
        }
      });
      setTotalRevenue(revenue);
      setTotalProfit(profit);
      setTotalOrders(orders);
      setMonthlySales(monthly);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const StatCard = ({ title, value, subValue }: { title: string; value: string; subValue: string }) => (
    <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{subValue}</p>
    </div>
  );


  if (loading) {
      return (
          <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {Array.from({length: 4}).map((_, i) => (
                      <Card key={i}>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <Skeleton className="h-4 w-2/3" />
                              <Skeleton className="h-6 w-6" />
                          </CardHeader>
                          <CardContent>
                              <Skeleton className="h-8 w-1/2 mb-2" />
                              <Skeleton className="h-3 w-full" />
                          </CardContent>
                      </Card>
                  ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                 <Card><CardContent className="p-6"><Skeleton className="w-full h-[350px]" /></CardContent></Card>
                 <Card><CardContent className="p-6"><Skeleton className="w-full h-[350px]" /></CardContent></Card>
              </div>
          </div>
      )
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Jun 1 - Aug 21, 2024</span>
                </p>
            </div>
            <div className="flex items-center gap-8">
                <StatCard title="EOI Sent" value={totalOrders.toString()} subValue={`₹${monthlySales.toLocaleString('en-IN')}`} />
                <StatCard title="New Requests" value={totalOrders.toString()} subValue={`₹${totalRevenue.toLocaleString('en-IN')}`} />
            </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Borrowers by State</CardTitle>
                    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                </CardHeader>
                <CardContent className="pl-2">
                    <PlatformChart />
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Revenue Overview</CardTitle>
                    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                </CardHeader>
                <CardContent className="pl-2">
                    <RevenueChart />
                </CardContent>
            </Card>
        </div>
         <div className="grid lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Details</CardTitle>
                    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                </CardHeader>
                <CardContent className="pl-2">
                     <PlatformChart />
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>New Request Trend</CardTitle>
                    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                </CardHeader>
                <CardContent className="pl-2">
                    <RevenueChart />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
