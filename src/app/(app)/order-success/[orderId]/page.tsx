
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Package } from 'lucide-react';
import { cancelOrder } from '@/ai/flows/orders-flow';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


function AnimatedCheck() {
    return (
        <svg
            className="h-24 w-24 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
        >
            <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="166"
                strokeDashoffset="166"
                style={{
                    animation: 'stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards',
                }}
            />
            <path
                className="checkmark__check"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="48"
                strokeDashoffset="48"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                style={{
                    animation: 'stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards',
                }}
            />
             <style jsx>{`
                @keyframes stroke {
                    100% {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </svg>
    )
}

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (orderId) {
      const getOrder = async () => {
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
        } else {
          // Handle order not found
        }
        setLoading(false);
      };
      getOrder();
    }
  }, [orderId]);

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
        await cancelOrder(orderId);
        toast({
            title: "Order Cancelled",
            description: "Your order has been successfully cancelled."
        });
        router.push("/orders");
    } catch (error) {
        toast({
            title: "Cancellation Failed",
            description: "There was an error cancelling your order. Please contact support.",
            variant: "destructive"
        });
    } finally {
        setIsCancelling(false);
    }
  };


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto">
          <CardHeader className="items-center text-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-8 w-48 mt-4" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </CardContent>
          <CardFooter className="flex-col gap-2">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
          </CardFooter>
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
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-lg mx-auto shadow-lg">
        <CardHeader className="items-center text-center p-8 bg-green-50 rounded-t-lg">
            <AnimatedCheck />
            <CardTitle className="text-3xl font-bold text-green-800 mt-4">Thank You for Your Order!</CardTitle>
            <p className="text-muted-foreground">Order ID: #{order.id.slice(-6)}</p>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your order has been placed successfully. We will contact you shortly on your WhatsApp number to confirm details and arrange payment.
          </p>
        </CardContent>
        <CardFooter className="flex-col gap-3 p-8 border-t">
          <Button onClick={() => router.push('/orders')} className="w-full" size="lg">
            View My Orders
          </Button>
          <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full text-destructive hover:text-destructive" disabled={isCancelling}>
                    {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                      <AlertDialogDescription>
                          This action cannot be undone. This will permanently cancel your order.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Keep Order</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancelOrder}>Yes, Cancel It</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>

        </CardFooter>
      </Card>
    </div>
  );
}
