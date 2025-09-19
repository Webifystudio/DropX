
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, where, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, ArrowUp, ArrowDown } from 'lucide-react';
import { RevenueChart } from '@/components/admin/revenue-chart';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@/lib/types';

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

  const overviewData = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, change: '+20.1% from last month' },
    { title: 'Total Profit', value: `₹${totalProfit.toLocaleString('en-IN')}`, icon: DollarSign, change: '+18.1% from last month' },
    { title: 'Sales', value: `+${monthlySales.toLocaleString('en-IN')}`, icon: ShoppingBag, change: '+12.2% from last month' },
    { title: 'Total Orders', value: `${totalOrders}`, icon: ShoppingBag, change: '+5 from last month' },
];


  if (loading) {
      return (
          <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
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
              <Card>
                  <CardHeader>
                      <Skeleton className="h-6 w-1/3" />
                  </CardHeader>
                  <CardContent>
                      <Skeleton className="w-full h-[350px]" />
                  </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {overviewData.map((item, index) => (
                <Card key={item.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{item.value}</div>
                        <p className="text-xs text-muted-foreground">{item.change}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="grid lg:grid-cols-1 gap-6">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <RevenueChart />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
