
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, Truck, User, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

type TrackOrderPageProps = {
    params: {
        orderId: string;
    };
};

async function getOrder(orderId: string): Promise<Order | null> {
    try {
        const orderRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(orderRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Order;
        }
        return null;
    } catch (error) {
        console.error("Error fetching order:", error);
        return null;
    }
}

const statusInfo = {
    'Processing': { icon: Package, color: 'bg-yellow-500', text: 'text-yellow-50' },
    'Confirmed': { icon: Package, color: 'bg-blue-500', text: 'text-blue-50' },
    'Shipped': { icon: Truck, color: 'bg-indigo-500', text: 'text-indigo-50' },
    'Delivered': { icon: CheckCircle, color: 'bg-green-500', text: 'text-green-50' },
    'Cancelled': { icon: CheckCircle, color: 'bg-red-500', text: 'text-red-50' },
}

export default async function TrackOrderPage({ params }: TrackOrderPageProps) {
    const order = await getOrder(params.orderId);

    if (!order) {
        notFound();
    }

    const orderDate = new Date(order.date.seconds * 1000);
    const currentStatus = statusInfo[order.status] || statusInfo['Processing'];
    const StatusIcon = currentStatus.icon;

    return (
        <div className="bg-muted min-h-screen py-8 sm:py-12 px-4">
            <div className="container mx-auto max-w-lg">
                 <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-xl font-bold">{process.env.NEXT_PUBLIC_SITE_NAME || 'DropX'}</span>
                </div>

                <Card className="overflow-hidden shadow-lg">
                    <CardHeader className="p-0">
                         <div className={cn("p-6", currentStatus.color, currentStatus.text)}>
                            <div className="flex items-center gap-3">
                                <StatusIcon className="h-8 w-8" />
                                <div>
                                    <p className="text-xl font-bold">{order.status}</p>
                                    <p className="text-sm opacity-90">
                                        {orderDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6 bg-background">
                        <div>
                             <p className="text-muted-foreground text-sm mb-2">Order #{order.id}</p>
                             <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.product.id} className="flex items-center gap-4 text-sm">
                                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border bg-slate-100">
                                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain" />
                                        </div>
                                        <div className="flex-grow font-medium">
                                            {item.quantity} x {item.product.name}
                                        </div>
                                        <p className="font-semibold">₹{(item.product.currentPrice * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <Separator />

                         <div>
                            <div className="flex justify-between text-sm">
                                <p>Order amount</p>
                                <p className="font-medium">₹{order.total.toLocaleString('en-IN')}</p>
                            </div>
                             <div className="flex justify-between text-sm mt-2">
                                <p>Shipping</p>
                                <p className="font-medium">Free</p>
                            </div>
                             <Separator className="my-3"/>
                             <div className="flex justify-between font-bold text-base">
                                <p>Total amount</p>
                                <p>₹{order.total.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                        
                        <Separator />

                        <div className="space-y-4 text-sm">
                            <h3 className="font-semibold text-base">Delivery Details</h3>
                            <div className="flex items-start gap-4">
                                <User className="h-5 w-5 text-muted-foreground mt-1" />
                                <div>
                                    <p className="font-medium">{order.shippingAddress.name}</p>
                                    <p className="text-muted-foreground">+91 {order.shippingAddress.whatsappNumber}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                                <div>
                                    <p className="font-medium">Shipping Address</p>
                                    <p className="text-muted-foreground">
                                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.pincode}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>
                 <div className="text-center mt-6 text-xs text-muted-foreground">
                    <p>Thank you for your order! Any questions? Contact us.</p>
                </div>
            </div>
        </div>
    )
}
