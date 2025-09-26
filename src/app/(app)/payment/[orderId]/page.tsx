
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Package, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');

  useEffect(() => {
    if (orderId) {
      const getOrder = async () => {
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const orderData = { id: docSnap.id, ...docSnap.data() } as Order;
          setOrder(orderData);

          const customerNumber = orderData.shippingAddress.whatsappNumber;
          const message = encodeURIComponent(`I have completed the payment for my order #${orderId.slice(-6)}.`);
          setWhatsAppUrl(`https://wa.me/91${customerNumber}?text=${message}`);

        } else {
          toast({
            title: "Order Not Found",
            description: "The order you are looking for does not exist.",
            variant: "destructive"
          })
        }
        setLoading(false);
      };
      getOrder();
    }
  }, [orderId, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto bg-gray-900 text-white border-gray-700">
          <CardHeader className="items-center text-center p-8">
            <Skeleton className="h-48 w-48 rounded-lg bg-gray-700" />
            <Skeleton className="h-8 w-48 mt-6 bg-gray-700" />
            <Skeleton className="h-4 w-64 mt-2 bg-gray-700" />
          </CardHeader>
          <CardContent className="p-8 text-center space-y-4">
            <Skeleton className="h-4 w-full bg-gray-700" />
            <Skeleton className="h-4 w-3/4 mx-auto bg-gray-700" />
          </CardContent>
          <CardContent className="p-8 border-t border-gray-700">
             <Skeleton className="h-12 w-full rounded-full bg-gray-700" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!order) {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
             <Package className="mx-auto h-24 w-24 text-muted-foreground" />
            <h1 className="mt-4 text-2xl font-bold">Order Not Found</h1>
            <p className="mt-2 text-muted-foreground">We couldn't find the order you're looking for.</p>
             <Button onClick={() => router.push('/')} className="mt-6">Go to Homepage</Button>
        </div>
    )
  }

  return (
    <div 
        className="min-h-screen py-12 px-4"
        style={{
            backgroundColor: '#1a2e23', // Dark green background
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
                    src="https://i.ibb.co/Q9qSgL6/qr.png" 
                    alt="Payment QR Code"
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-lg"
                    data-ai-hint="QR code"
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
           <p className="mt-6 text-xs text-lime-100/60">
                If you're not ready to pay now, no worries! We will contact you on your provided WhatsApp number for payment. Thank you for your order!
            </p>
        </div>
      </div>
       <div className="text-center mt-8">
            <Button onClick={() => router.push('/orders')} variant="link" className="text-lime-300/70 hover:text-lime-300">
                View My Orders
            </Button>
        </div>
    </div>
  );
}
