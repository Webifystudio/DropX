

'use client';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type PaymentPageProps = {
    params: {
        orderId: string;
    };
};

export default function PaymentPage({ params }: PaymentPageProps) {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [whatsAppUrl, setWhatsAppUrl] = useState('');

    useEffect(() => {
        async function fetchOrder() {
            try {
                const orderRef = doc(db, 'orders', params.orderId);
                const docSnap = await getDoc(orderRef);
                if (docSnap.exists()) {
                    const orderData = { id: docSnap.id, ...docSnap.data() } as Order;
                    setOrder(orderData);
                    
                    const customerNumber = orderData.shippingAddress.whatsappNumber;
                    const message = encodeURIComponent(`I have completed the payment for my order. Please do not delete the text below, as it contains your order ID.\n\nOrder ID: #${orderData.id.slice(-6)}`);
                    setWhatsAppUrl(`https://wa.me/91${customerNumber}?text=${message}`);

                } else {
                    // Handle order not found
                    router.push('/');
                }
            } catch (error) {
                console.error("Error fetching order:", error);
                router.push('/');
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [params.orderId, router]);

    const qrCodeUrl = order?.items?.[0]?.product?.qrCodeUrl || "https://i.ibb.co/Q9qSgL6/qr.png";
    const qrCodeHint = order?.items?.[0]?.product?.qrCodeUrl ? "product QR code" : "default QR code";

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#1a2e23]">
                <Loader2 className="h-12 w-12 animate-spin text-lime-300" />
            </div>
        )
    }

    if (!order) {
        return null; // Or show an error message
    }

    return (
        <div 
            className="min-h-screen py-12 px-4 flex items-center justify-center bg-background"
            style={{
                backgroundColor: '#1a2e23',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
        >
          <div className="max-w-md mx-auto bg-[#2e4b3a] rounded-2xl shadow-2xl overflow-hidden border border-lime-300/20">
            <div className="p-8 text-center text-white">
                <h1 className="text-3xl font-bold font-headline text-lime-300">Complete Your Payment</h1>
                <p className="mt-2 text-lime-100/80">
                    Scan the QR code below to pay for your order.
                </p>
            </div>

            <div className="px-8 pb-8">
                <div className="bg-white p-4 rounded-xl shadow-inner">
                    <Image
                        src={qrCodeUrl} 
                        alt="Payment QR Code"
                        width={400}
                        height={400}
                        className="w-full h-auto rounded-lg"
                        data-ai-hint={qrCodeHint}
                    />
                </div>
            </div>

            <div className="bg-[#1a2e23] p-8 text-center text-white">
                <p className="font-semibold text-lime-200">
                    After payment, please send a screenshot to our WhatsApp.
                </p>
                <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
                     <Button size="lg" className="w-full mt-4 h-14 rounded-full text-lg bg-lime-400 text-gray-900 hover:bg-lime-500 transition-transform active:scale-95">
                        <MessageSquare className="mr-2 h-6 w-6" />
                        Send Screenshot
                    </Button>
                </a>
               <Button size="lg" variant="ghost" className="w-full mt-4 h-14 rounded-full text-lg text-lime-300/70 hover:text-lime-300" onClick={() => router.push('/orders')}>
                    I'll do it later
                </Button>
               <p className="mt-6 text-xs text-lime-100/60">
                    If you're not ready to pay now, no worries! We have your order details and will contact you on your provided WhatsApp number for payment. Thank you for your order!
                </p>
            </div>
          </div>
        </div>
    );
}
