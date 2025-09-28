
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDocs, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Truck, CheckCircle, ShoppingCart, RefreshCcw, DollarSign } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Order, Creator } from '@/lib/types';


const storeSchema = z.object({
  name: z.string().min(3, 'Store name must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens are allowed.'),
  logo: z.any().optional(),
});

type StoreFormValues = z.infer<typeof storeSchema>;

type OrderStats = {
  total: number;
  processing: number;
  shipped: number;
  delivered: number;
}

function CreatorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [store, setStore] = useState<{ id: string; logoUrl?: string } | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats>({ total: 0, processing: 0, shipped: 0, delivered: 0 });
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
  });

  const storeName = watch('name');

  useEffect(() => {
    if (!user) return;

    let unsubscribeStore: () => void = () => {};
    let unsubscribeOrders: () => void = () => {};
    let unsubscribeCreator: () => void = () => {};

    // Listen for creator profile changes (for earnings)
    const creatorQuery = query(collection(db, 'creators'), where('creatorId', '==', user.uid));
    unsubscribeCreator = onSnapshot(creatorQuery, (snapshot) => {
        if (!snapshot.empty) {
            const creatorDoc = snapshot.docs[0];
            setCreator({ id: creatorDoc.id, ...creatorDoc.data() } as Creator);
        }
    });

    // Listen for store and associated orders
    const storesRef = collection(db, 'stores');
    const storeQuery = query(storesRef, where('creatorId', '==', user.uid));
    
    unsubscribeStore = onSnapshot(storeQuery, (storeSnapshot) => {
      setLoading(true);
      setLoadingOrders(true);

      if (!storeSnapshot.empty) {
        const storeDoc = storeSnapshot.docs[0];
        const data = storeDoc.data();
        setStore({ id: data.id, logoUrl: data.logoUrl });
        setValue('name', data.id);

        // Now that we have the store, listen for its orders
        const ordersQuery = query(collection(db, 'orders'), where('resellerId', '==', user.uid));
        unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
          const creatorOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
          setOrders(creatorOrders.sort((a,b) => b.date.seconds - a.date.seconds));

          const stats: OrderStats = { total: 0, processing: 0, shipped: 0, delivered: 0 };
          snapshot.forEach(doc => {
              const order = doc.data() as Order;
              stats.total++;
              if (order.status === 'Processing' || order.status === 'Confirmed') stats.processing++;
              if (order.status === 'Shipped') stats.shipped++;
              if (order.status === 'Delivered') stats.delivered++;
          });
          setOrderStats(stats);
          setLoadingOrders(false);
        });
      } else {
        setLoadingOrders(false);
      }
      setLoading(false);
    });
    
    return () => {
      unsubscribeStore();
      unsubscribeOrders();
      unsubscribeCreator();
    }
  }, [user, setValue]);


  const statCards = [
      { title: 'Total Orders', value: orderStats.total, icon: ShoppingCart, color: 'text-blue-500' },
      { title: 'Total Earnings', value: `₹${(creator?.totalEarnings || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-green-500' },
      { title: 'Pending', value: orderStats.processing, icon: RefreshCcw, color: 'text-yellow-500' },
      { title: 'Shipped', value: orderStats.shipped, icon: Truck, color: 'text-purple-500' },
  ];

  if (loading) {
      return (
          <div className="space-y-8">
              <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({length: 4}).map((_,i) => <Skeleton key={i} className="h-28 w-full" />)}
              </div>
              <Skeleton className="h-96 w-full" />
          </div>
      )
  }

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
         <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>Welcome, Creator!</CardTitle>
                <CardDescription>
                    Let's set up your storefront. Choose a unique name for your store. This will be your public URL.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(async (data) => {
                if (!user) return;
                try {
                    const storeData = {
                        id: data.name,
                        creatorId: user.uid,
                        creatorEmail: user.email,
                        logoUrl: '',
                    };
                    await setDoc(doc(db, 'stores', data.name), storeData);
                    toast({ title: "Store Created!", description: "Your storefront is now live." });
                    // The onSnapshot listener will update the state automatically
                } catch (error) {
                    console.error("Error creating store: ", error);
                    toast({ title: "Error", description: "This store name might already be taken.", variant: 'destructive' });
                }
            })}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Store Name</Label>
                        <div className="flex items-center">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">{origin}/</span>
                            <Input id="name" {...register('name')} className="ml-1" placeholder="your-store-name" />
                        </div>
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create My Store'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
            <p className="text-muted-foreground">An overview of your store's performance.</p>
        </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map(card => (
            <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                </CardHeader>
                <CardContent>
                    {loadingOrders ? <Skeleton className="h-8 w-1/2" /> : <div className="text-3xl font-bold">{card.value}</div> }
                </CardContent>
            </Card>
          ))}
      </div>

        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>A list of the 10 most recent orders.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loadingOrders ? (
                            Array.from({length: 5}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[100px] rounded-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            orders.slice(0, 10).map(order => (
                                 <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                                    <TableCell>{new Date(order.date.seconds * 1000).toLocaleDateString()}</TableCell>
                                    <TableCell>{order.shippingAddress.name}</TableCell>
                                    <TableCell>₹{order.total.toLocaleString('en-IN')}</TableCell>
                                    <TableCell><Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                 {orders.length === 0 && !loadingOrders && (
                    <div className="text-center py-12 text-muted-foreground">
                        <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
                        <p>No orders yet.</p>
                    </div>
                 )}
            </CardContent>
        </Card>
    </div>
  );
}

export default withCreatorAuth(CreatorDashboard);

    