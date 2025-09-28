
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { BatteryWarning } from 'lucide-react';
import Image from 'next/image';

function CreatorLowStockPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        
        async function fetchStoreAndProducts() {
            const storesRef = collection(db, 'stores');
            const q = query(storesRef, where("creatorId", "==", user!.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const storeDoc = querySnapshot.docs[0];
                const currentStoreId = storeDoc.id;

                const productsQuery = query(
                    collection(db, 'products'), 
                    where("supplierId", "==", currentStoreId),
                    where("stock", "<=", 10)
                );
                const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
                    const creatorProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product))
                        .filter(p => p.stock !== null && p.stock! > 0); // Exclude out of stock
                    setProducts(creatorProducts);
                    setLoading(false);
                });
                return unsubscribe;
            } else {
                setLoading(false);
            }
        }

        const unsubscribePromise = fetchStoreAndProducts();
        
        return () => {
            unsubscribePromise.then(unsubscribe => {
                if (unsubscribe) unsubscribe();
            });
        };
    }, [user]);
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">Low Stock Products</h1>
                <p className="text-muted-foreground">These products have 10 or fewer items in stock. Consider restocking soon.</p>
            </div>
            
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Stock Left</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({length: 3}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : products.length > 0 ? (
                                products.map(product => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Image src={product.images[0]} alt={product.name} width={40} height={40} className="rounded-md object-cover" />
                                                <span className="font-medium">{product.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-bold text-yellow-600">
                                            {product.stock}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="h-48 text-center">
                                        <BatteryWarning className="h-12 w-12 mx-auto text-muted-foreground" />
                                        <p className="mt-4 text-muted-foreground">No products are currently low on stock.</p>
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

export default withCreatorAuth(CreatorLowStockPage);

    