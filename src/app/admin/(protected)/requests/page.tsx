
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Plus, GitPullRequest } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AddProductDialog } from '@/components/admin/add-product-dialog';
import type { Product } from '@/lib/types';
import Image from 'next/image';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'products'), where('isActive', '==', false));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Product));
      setRequests(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteProduct = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        toast({
          title: 'Request Rejected',
          description: `"${productName}" has been successfully deleted.`,
        });
      } catch (error) {
        console.error("Error deleting product: ", error);
        toast({
          title: 'Error',
          description: 'Failed to delete product.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div>
            <CardTitle>Product Requests</CardTitle>
            <CardDescription>Review and approve products submitted by creators.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : requests.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <GitPullRequest className="h-16 w-16 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold">No Pending Requests</h2>
            <p>There are no new product submissions to review.</p>
          </div>
        ) : (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {requests.map((product) => (
                    <TableRow key={product.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Image src={product.images?.[0] || ''} alt={product.name} width={40} height={40} className="rounded-md object-cover" />
                            <span className="font-medium">{product.name}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline">{product.supplierId || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col">
                            <span className="font-bold">₹{product.currentPrice.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-muted-foreground line-through">₹{product.normalPrice.toLocaleString('en-IN')}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(product)}>Edit & Approve</DropdownMenuItem>
                            <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteProduct(product.id, product.name)}
                            >
                            Reject & Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
        )}
      </CardContent>
    </Card>

    <AddProductDialog
        product={editingProduct}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
    >
        {/* This is a dummy trigger, the dialog is controlled by state */}
        <span />
    </AddProductDialog>
    </>
  );
}
