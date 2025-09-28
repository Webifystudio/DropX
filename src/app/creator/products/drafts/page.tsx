
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

function CreatorDraftsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [drafts, setDrafts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        
        async function fetchStoreAndDrafts() {
            const storesRef = collection(db, 'stores');
            const q = query(storesRef, where("creatorId", "==", user!.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const storeDoc = querySnapshot.docs[0];
                const currentStoreId = storeDoc.id;

                const productsQuery = query(collection(db, 'products'), where("supplierId", "==", currentStoreId), where("isActive", "==", false));
                const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
                    const creatorDrafts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
                    setDrafts(creatorDrafts);
                    setLoading(false);
                });
                return unsubscribe;
            } else {
                setLoading(false);
            }
        }

        const unsubscribePromise = fetchStoreAndDrafts();
        
        return () => {
            unsubscribePromise.then(unsubscribe => {
                if (unsubscribe) unsubscribe();
            });
        };
    }, [user]);

    const deleteProduct = async (productId: string, productName: string) => {
        if (window.confirm(`Are you sure you want to delete the draft "${productName}"?`)) {
          try {
            await deleteDoc(doc(db, 'products', productId));
            toast({
              title: 'Draft Deleted',
              description: `"${productName}" has been successfully deleted.`,
            });
          } catch (error) {
            console.error("Error deleting product: ", error);
            toast({
              title: 'Error',
              description: 'Failed to delete draft.',
              variant: 'destructive',
            });
          }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">Drafts</h1>
                <p className="text-muted-foreground">These products have been submitted and are awaiting admin approval.</p>
            </div>
            
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({length: 3}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-28 rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : drafts.length > 0 ? (
                                drafts.map(product => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>₹{product.currentPrice.toLocaleString('en-IN')}</TableCell>
                                        <TableCell>{product.stock ?? '∞'}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">Pending Approval</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                     <DropdownMenuItem asChild>
                                                        <Link href={`/creator/products/edit/${product.id}`}><Edit className="mr-2 h-4 w-4" />Edit</Link>
                                                     </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="text-destructive"
                                                        onClick={() => deleteProduct(product.id, product.name)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        You have no products awaiting approval.
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

export default withCreatorAuth(CreatorDraftsPage);
