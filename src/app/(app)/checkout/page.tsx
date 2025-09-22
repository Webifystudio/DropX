
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
import { Terminal } from "lucide-react"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Store } from "@/lib/types"
import { useAuth } from "@/context/auth-context"


const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(10, { message: "Please enter a valid address." }),
  city: z.string().min(2, { message: "City is required." }),
  pincode: z.string().length(6, { message: "Pincode must be 6 digits." }),
  whatsappNumber: z.string().length(10, { message: "WhatsApp number must be 10 digits." }),
})

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    const savedStore = localStorage.getItem('currentStore');
    if (savedStore) {
        setStore(JSON.parse(savedStore));
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
    if (cartItems.length === 0) {
      router.push('/');
    }
  }, [cartItems, router]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const orderDocRef = await addDoc(collection(db, "orders"), {
            date: Timestamp.now(),
            total: cartTotal,
            status: "Processing",
            items: cartItems,
            shippingAddress: values,
            customerEmail: user?.email,
            resellerName: store?.id || process.env.NEXT_PUBLIC_RESELLER_NAME,
            resellerId: store?.creatorId || process.env.NEXT_PUBLIC_RESELLER_ID,
            resellerEmail: store?.creatorEmail || 'akirastreamingzone@gmail.com'
        });

        // Create a notification for the new order
        await addDoc(collection(db, "notifications"), {
            title: "New Order Received",
            description: `Order #${orderDocRef.id.slice(-6)} for ₹${cartTotal.toLocaleString('en-IN')} has been placed.`,
            date: Timestamp.now(),
            read: false,
            link: `/admin/orders`,
        });

        clearCart();
        localStorage.removeItem('currentStore');
        toast({
            title: "Order Placed!",
            description: "We will message you on WhatsApp to confirm your order.",
        });
        router.push("/orders");
    } catch (e) {
        console.error("Error adding document: ", e);
        toast({
            title: "Order Failed",
            description: "There was an error placing your order. Please try again.",
            variant: "destructive",
        });
    }
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
                  <Button type="submit" size="lg" className="w-full">Place Order</Button>
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
                        <span className="font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="font-medium">Free</span>
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
