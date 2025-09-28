
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { useState, useEffect, useMemo } from 'react';
import type { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

function CreatorOrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [storeId, setStoreId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        
        async function fetchStoreAndOrders() {
            setLoading(true);
            const storesRef = collection(db, 'stores');
            const q = query(storesRef, where("creatorId", "==", user!.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const storeDoc = querySnapshot.docs[0];
                const currentStoreId = storeDoc.id;
                setStoreId(currentStoreId);

                // Fetch all orders and filter client-side
                const ordersUnsubscribe = onSnapshot(query(collection(db, 'orders')), (snapshot) => {
                    const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                    const creatorOrders = allOrders.filter(order => 
                        order.items.some(item => item.product.supplierId === currentStoreId)
                    );
                    setOrders(creatorOrders.sort((a,b) => b.date.seconds - a.date.seconds));
                    setLoading(false);
                });
                return ordersUnsubscribe;

            } else {
                setLoading(false);
            }
        }

        const unsubscribePromise = fetchStoreAndOrders();
        
        return () => {
            unsubscribePromise.then(unsubscribe => {
                if (unsubscribe) unsubscribe();
            });
        };
    }, [user]);

    const filteredOrdersForCreator = (order: Order) => {
        if (!storeId) return [];
        return order.items.filter(item => item.product.supplierId === storeId);
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">My Orders</h1>
                <p className="text-muted-foreground">A read-only view of orders containing your products.</p>
            </div>
            
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>My Products</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({length: 5}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-6 w-24 rounded-full ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : orders.length > 0 ? (
                                orders.map(order => {
                                    const creatorItems = filteredOrdersForCreator(order);
                                    if (creatorItems.length === 0) return null;
                                    
                                    return (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                                            <TableCell>{new Date(order.date.seconds * 1000).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-2">
                                                    {creatorItems.map(item => (
                                                        <div key={item.product.id} className="flex items-center gap-2 text-sm">
                                                             <Image src={item.product.images[0]} alt={item.product.name} width={24} height={24} className="rounded-sm object-cover"/>
                                                            <span>{item.quantity} x {item.product.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-48 text-center">
                                        <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
                                        <p className="mt-4 text-muted-foreground">You have no orders yet.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default withCreatorAuth(CreatorOrdersPage);
