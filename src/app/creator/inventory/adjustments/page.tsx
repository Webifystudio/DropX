
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, getDocs, doc, writeBatch } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

function CreatorStockAdjustmentsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [adjustments, setAdjustments] = useState<Record<string, number>>({});
    const [isSaving, setIsSaving] = useState(false);

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

    const handleAdjustmentChange = (productId: string, value: string) => {
        const newStock = parseInt(value, 10);
        if (!isNaN(newStock) && newStock >= 0) {
            setAdjustments(prev => ({ ...prev, [productId]: newStock }));
        } else if (value === '') {
             setAdjustments(prev => ({ ...prev, [productId]: NaN }));
        }
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        const batch = writeBatch(db);
        const validAdjustments = Object.entries(adjustments).filter(([_, value]) => !isNaN(value));

        if (validAdjustments.length === 0) {
            toast({ title: 'No changes to save.', variant: 'default' });
            setIsSaving(false);
            return;
        }

        validAdjustments.forEach(([productId, newStock]) => {
            const productRef = doc(db, 'products', productId);
            batch.update(productRef, { stock: newStock });
        });

        try {
            await batch.commit();
            toast({ title: 'Success!', description: 'Stock levels have been updated.' });
            setAdjustments({});
        } catch (error) {
            console.error("Error updating stock: ", error);
            toast({ title: 'Error', description: 'Failed to update stock levels.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Stock Adjustments</h1>
                    <p className="text-muted-foreground">Manually update the stock levels for your products.</p>
                </div>
                <Button onClick={handleSaveChanges} disabled={isSaving || Object.keys(adjustments).length === 0}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
            
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="w-32 text-center">Current Stock</TableHead>
                                <TableHead className="w-48 text-right">New Stock</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({length: 4}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-10 w-32 ml-auto" /></TableCell>
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
                                        <TableCell className="text-center font-mono">
                                            {product.stock ?? '∞'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Input 
                                                type="number" 
                                                className="w-32 ml-auto text-right" 
                                                placeholder="New stock..."
                                                value={isNaN(adjustments[product.id]) ? '' : adjustments[product.id]}
                                                onChange={(e) => handleAdjustmentChange(product.id, e.target.value)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-48 text-center">
                                        <SlidersHorizontal className="h-12 w-12 mx-auto text-muted-foreground" />
                                        <p className="mt-4 text-muted-foreground">You have no products to adjust.</p>
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

export default withCreatorAuth(CreatorStockAdjustmentsPage);

    