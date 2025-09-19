
'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, where, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Package, Truck, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


function getStatusBadge(status: 'Processing' | 'Shipped' | 'Delivered' | 'Confirmed' | 'Cancelled') {
    switch (status) {
        case 'Processing':
            return <Badge variant="secondary"><Package className="h-3 w-3 mr-1" />{status}</Badge>;
        case 'Confirmed':
             return <Badge className="bg-yellow-500 hover:bg-yellow-600"><CheckCircle className="h-3 w-3 mr-1" />{status}</Badge>;
        case 'Shipped':
            return <Badge className="bg-blue-500 hover:bg-blue-600"><Truck className="h-3 w-3 mr-1" />{status}</Badge>;
        case 'Delivered':
            return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />{status}</Badge>;
        case 'Cancelled':
            return <Badge variant="destructive">{status}</Badge>;
    }
}

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setLoading(false);
            return;
        };

        const q = query(collection(db, 'orders'), where("shippingAddress.whatsappNumber", "==", user.phoneNumber)); // Assuming phone number is used to link orders
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(userOrders.sort((a,b) => b.date.seconds - a.date.seconds));
            setLoading(false);
        });

        return () => unsubscribe();

    }, [user, authLoading]);
    
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 font-headline">Your Orders</h1>
                <div className="space-y-6">
                    {Array.from({length: 3}).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-4 w-1/4" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-16 w-16 rounded-md" />
                                        <div className="flex-grow space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-1/4" />
                                        </div>
                                        <Skeleton className="h-4 w-1/6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (!user) {
         return (
            <div className="container mx-auto px-4 py-12 text-center">
              <Package className="mx-auto h-24 w-24 text-muted-foreground" />
              <h1 className="mt-4 text-2xl font-bold">Please sign in</h1>
              <p className="mt-2 text-muted-foreground">You need to be signed in to view your orders.</p>
              <Button asChild className="mt-6">
                <Link href="/admin/login">Sign In</Link>
              </Button>
            </div>
          );
    }
    
    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
              <Package className="mx-auto h-24 w-24 text-muted-foreground" />
              <h1 className="mt-4 text-2xl font-bold">No orders yet</h1>
              <p className="mt-2 text-muted-foreground">You haven't placed any orders with us. Let's change that!</p>
              <Button asChild className="mt-6">
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          );
    }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline">Your Orders</h1>
      <div className="space-y-6">
        {orders.map(order => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order #{order.id.slice(-6)}</CardTitle>
                <CardDescription>Date: {new Date(order.date.seconds * 1000).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
              </div>
              {getStatusBadge(order.status)}
            </CardHeader>
            <Separator />
            <CardContent className="p-6 space-y-4">
              {order.items.map(({product, quantity}) => (
                    <div key={product.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                            <Image src={product.images[0]} alt={product.name} fill objectFit="cover" />
                        </div>
                        <div className="flex-grow">
                            <p className="font-medium text-sm truncate">{product.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                        </div>
                        <p className="font-medium text-sm">₹{(product.currentPrice * quantity).toLocaleString('en-IN')}</p>
                    </div>
                  )
              )}
            </CardContent>
            <Separator />
            <div className="p-6 flex justify-between items-center">
                <span className="font-semibold text-lg">Total: ₹{order.total.toLocaleString('en-IN')}</span>
                <Button variant="outline">Track Order</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
