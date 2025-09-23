
'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, doc, updateDoc, getDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Package, Truck, CheckCircle, Mail, Search, MessageSquare, Copy, ExternalLink, User, X, Calendar as CalendarIcon, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, Supplier } from '@/lib/types';
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
import { sendOrderStatusEmail } from '@/ai/flows/send-email-flow';
import { render } from '@react-email/components';
import { OrderStatusEmail } from '@/components/emails/order-status-email';
import { NotifyCustomerDialog } from '@/components/admin/notify-customer-dialog';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { cancelOrder } from '@/ai/flows/orders-flow';


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
            return <Badge variant="destructive"><Ban className="h-3 w-3 mr-1" />{status}</Badge>;
    }
}


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithId[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithId | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [emailToSend, setEmailToSend] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [profit, setProfit] = useState(0);
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const supplierMap = useMemo(() => new Map(suppliers.map(s => [s.id, s])), [suppliers]);

  useEffect(() => {
    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersData: OrderWithId[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderWithId));
      setOrders(ordersData.sort((a, b) => b.date.seconds - a.date.seconds));
      setLoading(false);
    });

    const unsubscribeSuppliers = onSnapshot(collection(db, 'suppliers'), (snapshot) => {
        setSuppliers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier)));
    });

    return () => {
        unsubscribeOrders();
        unsubscribeSuppliers();
    };
  }, []);
  
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
        const orderDate = new Date(order.date.seconds * 1000);
        
        const searchMatch = !searchQuery || order.id.toLowerCase().includes(searchQuery.toLowerCase());
        const statusMatch = statusFilter === 'all' || order.status === statusFilter;
        const dateMatch = !dateRange || (
            (!dateRange.from || orderDate >= dateRange.from) &&
            (!dateRange.to || orderDate <= dateRange.to)
        );
        const supplierMatch = supplierFilter === 'all' || order.items.some(item => item.product.supplierId === supplierFilter);

        return searchMatch && statusMatch && dateMatch && supplierMatch;
    });
  }, [searchQuery, statusFilter, dateRange, supplierFilter, orders]);
  
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSupplierFilter('all');
    setDateRange(undefined);
  }

  const createNotification = async (orderId: string, status: string) => {
    let title = '';
    let description = '';
    
    switch (status) {
        case 'Confirmed':
            title = 'Order Confirmed';
            description = `Order #${orderId.slice(-6)} has been confirmed and is ready for processing.`;
            break;
        case 'Shipped':
            title = 'Order Shipped';
            description = `Order #${orderId.slice(-6)} has been shipped.`;
            break;
        case 'Delivered':
            title = 'Order Delivered';
            description = `Order #${orderId.slice(-6)} has been successfully delivered.`;
            break;
        case 'Cancelled':
            title = 'Order Cancelled';
            description = `Order #${orderId.slice(-6)} has been cancelled.`;
            break;
        default:
            return;
    }
    
    await addDoc(collection(db, "notifications"), {
        title,
        description,
        date: Timestamp.now(),
        read: false,
        link: `/admin/orders`,
    });
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const orderRef = doc(db, 'orders', orderId);
    try {
        if (status === 'Delivered') {
            const orderDoc = await getDoc(orderRef);
            if (orderDoc.exists()) {
                setSelectedOrder({ id: orderId, ...orderDoc.data() } as OrderWithId);
                setIsProfitModalOpen(true);
            }
        } else if (status === 'Cancelled') {
            await cancelOrder(orderId);
            toast({ title: "Order Cancelled", description: `Order #${orderId.slice(-6)} has been cancelled.` });
        } else {
            await updateDoc(orderRef, { status });
            await createNotification(orderId, status);
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
            await createNotification(selectedOrder.id, 'Delivered');
            toast({ title: "Order Delivered!", description: `Profit of ₹${profit} recorded.` });
            setIsProfitModalOpen(false);
            setProfit(0);
            setSelectedOrder(null);
        } catch (error) {
             toast({ title: "Error", description: "Failed to finalize order.", variant: "destructive" });
        }
    }
  };

  const handleSendStatusEmail = async () => {
    if (!selectedOrder || !emailToSend) return;

    setIsSendingEmail(true);
    try {
        const emailHtml = render(<OrderStatusEmail order={selectedOrder} />);
        
        await sendOrderStatusEmail({
            to: emailToSend,
            subject: `Your DropX Order #${selectedOrder.id.slice(-6)} is ${selectedOrder.status}`,
            html: emailHtml,
        });

        toast({
            title: "Email Sent!",
            description: `Order status email has been sent to ${emailToSend}.`
        });
        setIsEmailModalOpen(false);
        setEmailToSend('');
        setSelectedOrder(null);
    } catch (error) {
        console.error("Failed to send email:", error);
        toast({
            title: "Error Sending Email",
            description: "There was a problem sending the email. Please check the console.",
            variant: "destructive"
        });
    } finally {
        setIsSendingEmail(false);
    }
  };

  const openEmailModal = (order: OrderWithId) => {
    setSelectedOrder(order);
    setEmailToSend(order.resellerEmail || '');
    setIsEmailModalOpen(true);
  }

  const openNotifyModal = (order: OrderWithId) => {
    setSelectedOrder(order);
    setIsNotifyModalOpen(true);
  }

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
        <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Filter by Order ID..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>
             <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by supplier" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-[280px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? 
                            (dateRange.to ? `${format(dateRange.from, 'LLL dd, y')} - ${format(dateRange.to, 'LLL dd, y')}` : format(dateRange.from, 'LLL dd, y')) 
                            : <span>Pick a date range</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
                </PopoverContent>
            </Popover>
            <Button variant="ghost" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
            </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Reseller</TableHead>
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
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[100px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                  <TableCell>{order.shippingAddress.name}</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.resellerName || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">{order.resellerId}</div>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => openEmailModal(order)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Status Email
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Notify
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => openNotifyModal(order)}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openNotifyModal(order)}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Launch WhatsApp
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Confirmed')}>Mark as Confirmed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Shipped')}>Mark as Shipped</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Delivered')}>Mark as Delivered</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => updateOrderStatus(order.id, 'Cancelled')}>
                            <Ban className="mr-2 h-4 w-4" />
                            Cancel Order
                        </DropdownMenuItem>
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
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                {selectedOrder?.items.map(item => {
                    const supplier = item.product.supplierId ? supplierMap.get(item.product.supplierId) : null;
                    return (
                        <div key={item.product.id} className="flex items-start gap-4">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                <Image src={item.product.images[0]} alt={item.product.name} fill objectFit="cover" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-medium">{item.product.name}</p>
                                <div className="text-sm text-muted-foreground">
                                    {item.color && (
                                        <div className="flex items-center gap-2">Color: {item.color.name} <div className="h-3 w-3 rounded-full border" style={{ backgroundColor: item.color.code }}></div></div>
                                    )}
                                    {item.size && <p>Size: {item.size}</p>}
                                    <p>Qty: {item.quantity}</p>
                                </div>
                                {supplier && (
                                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                       <User className="h-3 w-3"/> Supplier: {supplier.name}
                                    </div>
                                )}
                            </div>
                            <p className="font-medium">₹{(item.product.currentPrice * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                    )
                })}
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

    <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Send Order Status Email</DialogTitle>
                <DialogDescription>
                    Enter the customer's email to send a status update for order #{selectedOrder?.id.slice(-6)}.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="email">Customer's Email</Label>
                <Input 
                    id="email" 
                    type="email"
                    value={emailToSend} 
                    onChange={(e) => setEmailToSend(e.target.value)}
                    placeholder="customer@example.com"
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSendStatusEmail} disabled={isSendingEmail || !emailToSend}>
                    {isSendingEmail ? 'Sending...' : 'Send Email'}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    {selectedOrder && (
        <NotifyCustomerDialog 
            order={selectedOrder} 
            isOpen={isNotifyModalOpen} 
            onOpenChange={setIsNotifyModalOpen} 
        />
    )}

    </>
  );
}
