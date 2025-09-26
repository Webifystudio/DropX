

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, History, Loader2, MessageSquare } from "lucide-react"
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Store, ShippingAddress, Order } from "@/lib/types"
import { useAuth } from "@/context/auth-context"
import { sendPushNotification } from "@/ai/flows/push-notifications-flow"
import { sendOrderStatusEmail } from "@/ai/flows/send-email-flow"
import { render } from "@react-email/components"
import { AdminNewOrderEmail } from "@/components/emails/admin-new-order-email"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(10, { message: "Please enter a valid address." }),
  city: z.string().min(2, { message: "City is required." }),
  pincode: z.string().length(6, { message: "Pincode must be 6 digits." }),
  whatsappNumber: z.string().length(10, { message: "WhatsApp number must be 10 digits." }),
})

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, shippingTotal, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [store, setStore] = useState<Store | null>(null);
  const [savedAddress, setSavedAddress] = useState<ShippingAddress | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');


  useEffect(() => {
    const savedStore = localStorage.getItem('currentStore');
    if (savedStore) {
        setStore(JSON.parse(savedStore));
    }
    const addressFromStorage = localStorage.getItem('savedShippingAddress');
    if (addressFromStorage) {
        setSavedAddress(JSON.parse(addressFromStorage));
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      pincode: "",
      whatsappNumber: "",
    },
  })
  
  useEffect(() => {
    if (cartItems.length === 0 && step === 'address') {
      router.push('/');
    }
  }, [cartItems, router, step]);

  const notifyAdmins = async (orderId: string, orderTotal: number) => {
    const subscriptionsSnapshot = await getDocs(collection(db, "pushSubscriptions"));
    subscriptionsSnapshot.forEach(async (doc) => {
      const subscription = doc.data();
      const payload = {
        title: 'New Order Received!',
        body: `Order #${orderId.slice(-6)} for ₹${orderTotal.toLocaleString('en-IN')} has been placed.`,
        url: `/admin/orders`
      };
      try {
        await sendPushNotification({ subscription, payload: JSON.stringify(payload) });
      } catch (e) {
        console.error('Error sending push notification, maybe subscription is expired', e);
      }
    });
  }

  const sendAdminOrderEmail = async (order: Order) => {
    try {
        const emailHtml = render(<AdminNewOrderEmail order={order} />);
        
        await sendOrderStatusEmail({
            to: 'dropxindia.in@gmail.com',
            subject: `[New Order] #${order.id.slice(-6)} from ${order.shippingAddress.name}`,
            html: emailHtml,
        });
    } catch (error) {
        console.error("Failed to send admin new order email:", error);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if(!user) {
        toast({
            title: "Authentication Error",
            description: "You must be logged in to place an order.",
            variant: "destructive",
        });
        return;
    }
    
    setIsPlacingOrder(true);

    try {
        const serializableCartItems = cartItems.map(item => {
            const { createdAt, updatedAt, ...restOfProduct } = item.product;
            return {
                ...item,
                product: restOfProduct,
            };
        });

        const orderData = {
            date: Timestamp.now(),
            total: cartTotal,
            status: "Processing" as const,
            items: serializableCartItems,
            shippingAddress: values,
            customerEmail: user.email,
            resellerName: store?.id || process.env.NEXT_PUBLIC_SITE_NAME || "DropX",
            resellerId: store?.creatorId || process.env.NEXT_PUBLIC_RESELLER_ID || "default",
            resellerEmail: store?.creatorEmail || 'akirastreamingzone@gmail.com'
        };

        const orderDocRef = await addDoc(collection(db, "orders"), orderData);

        const newOrder: Order = {
            id: orderDocRef.id,
            ...orderData
        };
        
        setPlacedOrder(newOrder);

        const customerNumber = newOrder.shippingAddress.whatsappNumber;
        const message = encodeURIComponent(`I have completed the payment for my order. Please do not delete the text below, as it contains your order ID.\n\nOrder ID: #${newOrder.id.slice(-6)}`);
        setWhatsAppUrl(`https://wa.me/91${customerNumber}?text=${message}`);
        
        await sendAdminOrderEmail(newOrder);

        await addDoc(collection(db, "notifications"), {
            title: "New Order Received",
            description: `Order #${orderDocRef.id.slice(-6)} for ₹${cartTotal.toLocaleString('en-IN')} has been placed.`,
            date: Timestamp.now(),
            read: false,
            link: `/admin/orders`,
        });

        await notifyAdmins(orderDocRef.id, cartTotal);

        localStorage.setItem('savedShippingAddress', JSON.stringify(values));
        
        toast({
            title: "Order Placed!",
            description: "Please complete the payment to confirm your order.",
        });

        localStorage.removeItem('currentStore');
        setStep('payment');

    } catch (e) {
        console.error("Error adding document: ", e);
        toast({
            title: "Order Failed",
            description: "There was an error placing your order. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsPlacingOrder(false);
    }
  }

  if (step === 'payment') {
      const qrCodeUrl = placedOrder?.items?.[0]?.product?.qrCodeUrl || "https://i.ibb.co/Q9qSgL6/qr.png";
      const qrCodeHint = placedOrder?.items?.[0]?.product?.qrCodeUrl ? "product QR code" : "default QR code";

      return (
            <div 
                className="py-12 px-4 flex items-center justify-center bg-background"
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
      )
  }

  if (cartItems.length === 0) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              {savedAddress && (
                  <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => form.reset(savedAddress)}
                      className="w-full mb-6"
                  >
                      <History className="mr-2 h-4 w-4" /> Use Previous Address
                  </Button>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="House no, Building, Street, Area" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Your city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="6-digit pincode" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <div className="grid md:grid-cols-2 gap-6">
                     <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input value="India" disabled />
                        </FormControl>
                      </FormItem>
                    <FormField
                        control={form.control}
                        name="whatsappNumber"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>WhatsApp Number</FormLabel>
                            <FormControl>
                                <Input type="tel" placeholder="10-digit number" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                   </div>
                   <Alert variant="destructive">
                      <Terminal className="h-4 w-4" />
                      <AlertTitle>Heads up!</AlertTitle>
                      <AlertDescription>
                        Please double-check your address. We are not responsible for orders shipped to an incorrect address.
                      </AlertDescription>
                    </Alert>
                  <Button type="submit" size="lg" className="w-full" disabled={isPlacingOrder}>
                    {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isPlacingOrder ? 'Placing Order...' : 'Next'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {cartItems.map(item => (
                        <div key={item.product.id} className="flex items-center gap-4">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                <Image src={item.product.images[0]} alt={item.product.name} fill objectFit="cover" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-medium text-sm truncate">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-sm">₹{(item.product.currentPrice * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                    ))}
                    <Separator />
                     <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="font-medium">{shippingTotal > 0 ? `₹${shippingTotal.toLocaleString('en-IN')}` : 'Free'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
