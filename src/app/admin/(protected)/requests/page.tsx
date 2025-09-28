
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, deleteDoc, doc, updateDoc, getDocs, runTransaction, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Plus, GitPullRequest, DollarSign, Check, X, Copy } from 'lucide-react';
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
import type { Product, WithdrawalRequest } from '@/lib/types';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default function AdminRequestsPage() {
  const [productRequests, setProductRequests] = useState<Product[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const productQuery = query(collection(db, 'products'), where('isActive', '==', false));
    const productsUnsubscribe = onSnapshot(productQuery, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Product));
      setProductRequests(productsData);
      setLoading(false);
    });

    const withdrawalQuery = query(collection(db, 'withdrawal_requests'), where('status', '==', 'pending'));
    const withdrawalUnsubscribe = onSnapshot(withdrawalQuery, (snapshot) => {
        const requestsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as WithdrawalRequest));
        setWithdrawalRequests(requestsData);
    });

    return () => {
        productsUnsubscribe();
        withdrawalUnsubscribe();
    }
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

  const createCreatorNotification = async (creatorId: string, title: string, description: string, status: 'paid' | 'rejected') => {
      try {
        await addDoc(collection(db, 'creator_notifications'), {
            creatorId,
            title,
            description,
            status,
            date: Timestamp.now(),
            read: false
        });
      } catch (error) {
          console.error("Error creating creator notification: ", error);
      }
  }
  
  const handleMarkAsPaid = async (request: WithdrawalRequest) => {
    try {
        await runTransaction(db, async (transaction) => {
            const creatorsRef = collection(db, 'creators');
            const q = query(creatorsRef, where('creatorId', '==', request.creatorId));
            const creatorSnapshot = await getDocs(q);

            if (creatorSnapshot.empty) {
                throw new Error(`Creator with auth ID ${request.creatorId} not found.`);
            }
            
            const creatorDoc = creatorSnapshot.docs[0];
            const creatorRef = creatorDoc.ref;
            const currentEarnings = creatorDoc.data().totalEarnings || 0;
            const newEarnings = currentEarnings - request.withdrawalAmount;

            if (newEarnings < 0) {
                 throw new Error('Withdrawal amount exceeds current balance. Cannot process.');
            }

            transaction.update(creatorRef, { totalEarnings: newEarnings });
            
            const requestRef = doc(db, 'withdrawal_requests', request.id);
            transaction.update(requestRef, { status: 'paid' });
        });

        await createCreatorNotification(
            request.creatorId,
            'Withdrawal Processed',
            `Your withdrawal request of ₹${request.withdrawalAmount.toLocaleString('en-IN')} has been successfully paid.`,
            'paid'
        );

        toast({
            title: 'Payment Processed',
            description: `Withdrawal for ${request.creatorName} has been marked as paid.`,
        });
    } catch (error) {
        console.error("Error processing withdrawal: ", error);
        toast({
          title: 'Error',
          description: (error as Error).message || 'Failed to process withdrawal.',
          variant: 'destructive',
        });
    }
  };

  const handleRejectWithdrawal = async (request: WithdrawalRequest) => {
    if (window.confirm('Are you sure you want to reject and delete this withdrawal request?')) {
        try {
            await deleteDoc(doc(db, 'withdrawal_requests', request.id));
             await createCreatorNotification(
                request.creatorId,
                'Withdrawal Rejected',
                `Your withdrawal request of ₹${request.withdrawalAmount.toLocaleString('en-IN')} was rejected. Please contact support.`,
                'rejected'
            );
            toast({
                title: 'Request Rejected',
                description: 'The withdrawal request has been deleted.',
            });
        } catch (error) {
             toast({
                title: 'Error',
                description: 'Failed to reject request.',
                variant: 'destructive',
            });
        }
    }
  }


  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  }
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied!",
        description: "UPI ID has been copied to your clipboard.",
    })
  }

  return (
    <>
    <div className="space-y-8">
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
                ) : productRequests.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <GitPullRequest className="h-16 w-16 mx-auto" />
                    <h2 className="mt-4 text-xl font-semibold">No Pending Product Requests</h2>
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
                        {productRequests.map((product) => (
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

        <Card>
            <CardHeader>
                <div>
                    <CardTitle>Withdrawal Requests</CardTitle>
                    <CardDescription>Review and process payout requests from creators.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                <Skeleton className="h-64 w-full" />
                ) : withdrawalRequests.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <DollarSign className="h-16 w-16 mx-auto" />
                        <h2 className="mt-4 text-xl font-semibold">No Pending Withdrawal Requests</h2>
                        <p>There are no new payout requests to process.</p>
                    </div>
                ) : (
                     <div className="divide-y">
                        {withdrawalRequests.map(request => (
                            <div key={request.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex-grow">
                                    <p className="font-semibold text-lg">{request.creatorName}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer" onClick={() => copyToClipboard(request.creatorUpiId)}>
                                        <span>{request.creatorUpiId}</span>
                                        <Copy className="h-3 w-3" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(request.requestDate.seconds * 1000).toLocaleString()}
                                    </p>
                                </div>
                                 <div className="text-right flex-shrink-0">
                                    <p className="text-2xl font-bold text-destructive">₹{request.withdrawalAmount.toLocaleString('en-IN')}</p>
                                    <p className="text-xs text-muted-foreground">from ₹{request.currentBalance.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="flex gap-2 self-start sm:self-center">
                                    <Button size="sm" variant="outline" onClick={() => handleMarkAsPaid(request)}>
                                        <Check className="mr-1 h-4 w-4" /> Mark as Paid
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleRejectWithdrawal(request)}>
                                        <X className="mr-1 h-4 w-4" /> Reject
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    </div>

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
