'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

function getPlaceholderImage(id: string) {
    const image = PlaceHolderImages.find((img) => img.id === id);
    return image || { imageUrl: 'https://picsum.photos/seed/placeholder/600/600', imageHint: 'placeholder' };
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(({ product, quantity }) => {
            const { imageUrl, imageHint } = getPlaceholderImage(product.images[0]);
            return (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="flex gap-4 p-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                   <Image src={imageUrl} alt={product.name} layout="fill" objectFit="cover" data-ai-hint={imageHint} />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                    <div>
                        <Link href={`/${product.id}`} className="font-medium hover:text-primary">{product.name}</Link>
                        <p className="text-lg font-semibold mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity - 1)}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input type="number" value={quantity} readOnly className="h-8 w-14 text-center mx-2" />
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity + 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(product.id)}>
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          )})}
        </div>
        
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span>Subtotal ({cartCount} items)</span>
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
                </CardContent>
                <CardFooter>
                    <Button asChild size="lg" className="w-full">
                        <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>

      </div>
    </div>
  );
}
