
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Boxes } from 'lucide-react';
import Image from 'next/image';

function CreatorInventoryPage() {
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

                const productsQuery = query(collection(db, 'products'), where("supplierId", "==", currentStoreId));
                const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
                    const creatorProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
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
    
    const getStockBadgeVariant = (stock: number | null | undefined): "default" | "secondary" | "destructive" | "outline" => {
        if (stock === null || stock === undefined) return "default";
        if (stock === 0) return "destructive";
        if (stock <= 10) return "secondary";
        return "outline";
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">Stock Overview</h1>
                <p className="text-muted-foreground">Monitor the inventory levels for all of your products.</p>
            </div>
            
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-center">Stock Level</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({length: 5}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell className="text-center"><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-6 w-24 rounded-full ml-auto" /></TableCell>
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
                                        <TableCell className="text-center font-mono font-semibold">
                                            {product.stock ?? '∞'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={getStockBadgeVariant(product.stock)}>
                                                {product.stock === null || product.stock === undefined ? 'Infinite' : product.stock === 0 ? 'Out of Stock' : product.stock <= 10 ? 'Low Stock' : 'In Stock'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-48 text-center">
                                        <Boxes className="h-12 w-12 mx-auto text-muted-foreground" />
                                        <p className="mt-4 text-muted-foreground">You haven't added any products yet.</p>
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

export default withCreatorAuth(CreatorInventoryPage);

    