
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Package, Truck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@/lib/types';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type OrderWithId = Order & { id: string };

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


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithId | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);
  const [profit, setProfit] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersData: OrderWithId[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderWithId));
      setOrders(ordersData.sort((a, b) => b.date.seconds - a.date.seconds));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const orderRef = doc(db, 'orders', orderId);
    try {
        if (status === 'Delivered') {
            const orderDoc = await getDoc(orderRef);
            if (orderDoc.exists()) {
                setSelectedOrder({ id: orderId, ...orderDoc.data() } as OrderWithId);
                setIsProfitModalOpen(true);
            }
        } else {
            await updateDoc(orderRef, { status });
            toast({ title: "Order Status Updated", description: `Order #${orderId.slice(-6)} is now ${status}.` });
        }
    } catch (error) {
        toast({ title: "Error", description: "Failed to update order status.", variant: "destructive" });
    }
  };

  const handleProfitSubmit = async () => {
    if (selectedOrder) {
        const orderRef = doc(db, 'orders', selectedOrder.id);
        try {
            await updateDoc(orderRef, { status: 'Delivered', profit });
            toast({ title: "Order Delivered!", description: `Profit of ₹${profit} recorded.` });
            setIsProfitModalOpen(false);
            setProfit(0);
            setSelectedOrder(null);
        } catch (error) {
             toast({ title: "Error", description: "Failed to finalize order.", variant: "destructive" });
        }
    }
  };

  const viewOrderDetails = (order: OrderWithId) => {
      setSelectedOrder(order);
      setIsDetailsOpen(true);
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Manage your customer orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[100px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                  <TableCell>{order.shippingAddress.name}</TableCell>
                  <TableCell>{new Date(order.date.seconds * 1000).toLocaleDateString()}</TableCell>
                  <TableCell>₹{order.total.toLocaleString('en-IN')}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
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
                        <DropdownMenuItem onClick={() => viewOrderDetails(order)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Confirmed')}>Mark as Confirmed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Shipped')}>Mark as Shipped</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Delivered')}>Mark as Delivered</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => updateOrderStatus(order.id, 'Cancelled')}>Cancel Order</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Order #{selectedOrder?.id.slice(-6)}</DialogTitle>
                <DialogDescription>
                    {selectedOrder?.shippingAddress.name} - {selectedOrder?.shippingAddress.whatsappNumber}
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                {selectedOrder?.items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                            <Image src={item.product.images[0]} alt={item.product.name} fill objectFit="cover" />
                        </div>
                        <div className="flex-grow">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">₹{(item.product.currentPrice * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                ))}
            </div>
             <Separator />
            <div className="grid gap-2 text-sm">
                <div className="font-semibold">Shipping Address</div>
                <p>{selectedOrder?.shippingAddress.address}</p>
                <p>{selectedOrder?.shippingAddress.city}, {selectedOrder?.shippingAddress.pincode}</p>
                <p>India</p>
            </div>
            <DialogFooter>
                <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    <Dialog open={isProfitModalOpen} onOpenChange={setIsProfitModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Record Profit</DialogTitle>
                <DialogDescription>
                    Enter the profit for order #{selectedOrder?.id.slice(-6)}.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="profit">Profit Amount (₹)</Label>
                <Input 
                    id="profit" 
                    type="number"
                    value={profit} 
                    onChange={(e) => setProfit(Number(e.target.value))}
                    placeholder="Enter profit amount"
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsProfitModalOpen(false)}>Cancel</Button>
                <Button onClick={handleProfitSubmit}>Confirm Delivery & Save Profit</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    </>
  );
}
