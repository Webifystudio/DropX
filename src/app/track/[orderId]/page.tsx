
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { OrderStatusTimeline } from '@/components/order-status-timeline';
import { Logo } from '@/components/icons';

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

export default async function TrackOrderPage({ params }: TrackOrderPageProps) {
    const order = await getOrder(params.orderId);

    if (!order) {
        notFound();
    }

    const orderDate = new Date(order.date.seconds * 1000);

    return (
        <div className="bg-muted min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                 <div className="flex items-center justify-center gap-2 mb-8">
                    <Logo className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold">{process.env.NEXT_PUBLIC_SITE_NAME || 'DropX'}</span>
                </div>

                <Card className="overflow-hidden shadow-lg">
                    <CardHeader className="bg-background/50 p-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                            <div>
                                <CardTitle className="text-2xl">Order #{order.id.slice(-6)}</CardTitle>
                                <CardDescription>Placed on {orderDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-primary mt-2 sm:mt-0">
                                ₹{order.total.toLocaleString('en-IN')}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        <div>
                            <h3 className="font-semibold mb-4 text-lg">Order Status</h3>
                            <OrderStatusTimeline status={order.status} />
                        </div>
                        
                        <Separator />

                        <div>
                            <h3 className="font-semibold mb-4 text-lg">Items in your order</h3>
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.product.id} className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-slate-100">
                                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium text-sm">{item.product.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium text-sm">₹{(item.product.currentPrice * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <Separator />

                        <div className="grid sm:grid-cols-2 gap-6 text-sm">
                            <div>
                                <h3 className="font-semibold mb-2 text-base">Shipping Address</h3>
                                <div className="text-muted-foreground">
                                    <p>{order.shippingAddress.name}</p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.pincode}</p>
                                    <p>India</p>
                                </div>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2 text-base">Contact</h3>
                                <p className="text-muted-foreground">WhatsApp: +91 {order.shippingAddress.whatsappNumber}</p>
                                {order.customerEmail && <p className="text-muted-foreground">Email: {order.customerEmail}</p>}
                            </div>
                        </div>

                    </CardContent>
                </Card>
                 <div className="text-center mt-6 text-xs text-muted-foreground">
                    <p>Thank you for your order!</p>
                </div>
            </div>
        </div>
    )
}
