
'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/account');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-6 w-1/3" />
            </div>
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4 items-center">
                        <Skeleton className="h-20 w-20 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-6 w-1/4" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                    </div>
                ))}
            </div>
            <div className="mt-8 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                 <Skeleton className="h-12 w-full" />
            </div>
        </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
                <ArrowLeft />
            </Button>
            <h1 className="text-2xl font-bold">My Cart</h1>
        </div>

      <div className="space-y-6">
        {cartItems.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 p-2">
              <Image src={product.images[0]} alt={product.name} fill className="object-contain" />
            </div>
            <div className="flex-grow">
              <Link href={`/product/${product.id}`} className="font-semibold hover:text-primary">{product.name}</Link>
              <p className="text-sm text-muted-foreground">250gm</p>
              <p className="text-lg font-bold mt-1">₹{product.currentPrice.toLocaleString('en-IN')}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(product.id, quantity - 1)}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold w-4 text-center">{quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(product.id, quantity + 1)}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive rounded-full" onClick={() => removeFromCart(product.id)}>
                <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>
      
      <Separator className="my-8"/>

      <div className="flex items-center">
        <Input placeholder="Enter coupon code" className="h-12 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0" />
        <Button className="h-12 rounded-l-none px-6">Apply</Button>
      </div>

       <div className="mt-8 space-y-4 text-lg">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Sub Total</span>
                <span className="font-semibold">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery fee</span>
                <span className="font-semibold">Free</span>
            </div>
             <Separator/>
            <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
        </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button asChild size="lg" className="w-full h-14 text-lg rounded-full">
              <Link href="/checkout">Checkout</Link>
          </Button>
      </div>
    </div>
  );
}
