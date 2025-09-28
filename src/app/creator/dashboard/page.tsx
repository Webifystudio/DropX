
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
import { Package, Truck, CheckCircle, ShoppingCart, RefreshCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/lib/types';


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
    if (!user || !user.email) return;

    let unsubscribeOrders: () => void = () => {};

    async function fetchStoreAndOrders() {
      const storesRef = collection(db, 'stores');
      const storeQuery = query(storesRef, where('creatorEmail', '==', user!.email));
      
      const unsubscribeStore = onSnapshot(storeQuery, (storeSnapshot) => {
        if (!storeSnapshot.empty) {
          const storeDoc = storeSnapshot.docs[0];
          const data = storeDoc.data();
          setStore({ id: data.id, logoUrl: data.logoUrl });
          setValue('name', data.id);

          const ordersQuery = query(collection(db, 'orders'), where('resellerId', '==', data.id));
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
        }
        setLoading(false);
      });
      
      return () => {
        unsubscribeStore();
        unsubscribeOrders();
      }
    }
    
    fetchStoreAndOrders();

  }, [user, setValue]);

  const onSubmit = async (data: StoreFormValues) => {
    if (!user) return;

    try {
      let logoUrl = store?.logoUrl || '';
      const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

      if (data.logo && data.logo.length > 0) {
        if (!imgbbApiKey) {
            toast({ title: "Error", description: "IMGBB API Key is not configured.", variant: "destructive" });
            return;
        }
        const file = data.logo[0];
        const formData = new FormData();
        formData.append("image", file);
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          logoUrl = result.data.url;
        } else {
          throw new Error(`Image upload failed: ${result.error.message}`);
        }
      }
      
      const storeData = {
        id: data.name,
        creatorId: user.uid,
        creatorEmail: user.email,
        logoUrl: logoUrl,
      };

      const storeDocRef = doc(db, 'stores', data.name);
      await setDoc(storeDocRef, storeData);
      
      toast({
        title: 'Store Updated!',
        description: 'Your store information has been saved.',
      });
    } catch (error) {
      console.error('Error saving store:', error);
      toast({
        title: 'Error',
        description: 'Failed to save store information.',
        variant: 'destructive',
      });
    }
  };

  const statCards = [
      { title: 'Total Orders', value: orderStats.total, icon: ShoppingCart, color: 'text-blue-500' },
      { title: 'Pending', value: orderStats.processing, icon: RefreshCcw, color: 'text-yellow-500' },
      { title: 'Shipped', value: orderStats.shipped, icon: Truck, color: 'text-purple-500' },
      { title: 'Delivered', value: orderStats.delivered, icon: CheckCircle, color: 'text-green-500' },
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
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">Setup Your Store</h1>
        <p className="text-muted-foreground mb-8">
            Create your storefront to start selling. Choose a unique name for your store's URL.
        </p>
         <Card>
            <CardHeader>
            <CardTitle>Create Your Store</CardTitle>
            <CardDescription>
                This name will be your unique store URL. It can't be changed later.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="name">Store Name (URL)</Label>
                <Input
                    id="name"
                    {...register('name')}
                    placeholder="e.g., my-awesome-store"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                {origin && storeName && (
                    <p className="text-sm text-muted-foreground">
                    Your store will be available at: {origin}/<span className="font-medium text-primary">{storeName}</span>
                    </p>
                )}
                </div>
                <div className="space-y-2">
                <Label htmlFor="logo">Store Logo (Optional)</Label>
                <Input id="logo" type="file" {...register('logo')} />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Store'}
                </Button>
            </form>
            </CardContent>
        </Card>
      </div>
    )
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
