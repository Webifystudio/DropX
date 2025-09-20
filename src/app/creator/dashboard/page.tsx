
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
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
  const { user, signOut } = useAuth();
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
    if (!user) return;
    
    async function fetchStore() {
        const storeDocRef = doc(db, 'stores', user.uid);
        const docSnap = await getDoc(storeDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStore({ id: data.id, logoUrl: data.logoUrl });
          setValue('name', data.id);
        }
        setLoading(false);
    }
    
    fetchStore();

    const q = query(collection(db, 'orders'), where('resellerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const creatorOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        setOrders(creatorOrders);

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

    return () => unsubscribe();
  }, [user, setValue]);

  const onSubmit = async (data: StoreFormValues) => {
    if (!user) return;

    try {
      let logoUrl = store?.logoUrl || '';
      const imgbbApiKey = "81b665cd5c10e982384fcdec4b410fba";

      if (data.logo && data.logo.length > 0) {
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

      const storeDocRef = doc(db, 'stores', user.uid);
      await setDoc(storeDocRef, storeData);
      
      setStore({ id: data.name, logoUrl });

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
          <div className="container mx-auto px-4 py-8 space-y-8">
              <div className="flex justify-between items-center">
                  <div>
                      <Skeleton className="h-8 w-64 mb-2" />
                      <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-10 w-24" />
              </div>
              <Card>
                  <CardHeader>
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-10 w-full" />
                      </div>
                       <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-10 w-full" />
                      </div>
                      <Skeleton className="h-10 w-32" />
                  </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Creator Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}!</p>
        </div>
        <Button onClick={signOut}>Sign Out</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                <CardTitle>Your Store</CardTitle>
                <CardDescription>
                    Setup your storefront name and logo. The store name will be used for your unique URL.
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
                        disabled={!!store}
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
                    {store?.logoUrl && <img src={store.logoUrl} alt="Store logo" className="mt-4 h-20 w-20 object-cover rounded-md" />}
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Settings'}
                    </Button>
                </form>
                </CardContent>
            </Card>
            
            {store && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Your Store Link</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Your store is live! You can access it here:</p>
                        <Link href={`/${store.id}`} className="text-primary font-bold hover:underline" target="_blank">
                            {origin}/{store.id}
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
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
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

export default withCreatorAuth(CreatorDashboard);
