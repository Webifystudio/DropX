
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Drawer } from 'vaul';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { ArrowLeft, Heart, Share, Star, ShoppingCart } from 'lucide-react';
import { AddToCartButton } from './add-to-cart-button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel"
import { useCart } from '@/context/cart-context';
import { useState } from 'react';
import Link from 'next/link';

type ProductViewProps = {
  product: Product;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};


export function ProductView({ product, isOpen, setIsOpen }: ProductViewProps) {
  const router = useRouter();
  const { addToCart, cartCount } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');

  const discount = product.normalPrice && product.currentPrice ? Math.round(((product.normalPrice - product.currentPrice) / product.normalPrice) * 100) : 0;

  const handleBuyNow = () => {
    addToCart(product);
    router.push('/cart');
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 z-50">
            <Drawer.Title className="sr-only">{product.name}</Drawer.Title>
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-2" />
            <div className="p-4 bg-background flex-1 overflow-y-auto">
                
                <div className="sticky top-0 bg-background py-2 -mt-4 z-10">
                    <div className="flex justify-between items-center">
                         <Drawer.Close asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                         </Drawer.Close>
                         <h2 className="font-semibold text-lg">Detail Product</h2>
                         <Link href="/cart" className="relative p-2">
                            <ShoppingCart className="h-6 w-6 text-gray-800" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                <div className="pt-4">
                    <Carousel className="w-full max-w-lg mx-auto">
                        <CarouselContent>
                            {(product.images || []).map((imageUrl, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-0 flex aspect-square items-center justify-center relative">
                                    <Image
                                        src={imageUrl}
                                        alt={`${product.name} - image ${index + 1}`}
                                        fill
                                        className="object-contain"
                                        data-ai-hint="product photo"
                                    />
                                    </div>
                                </CarouselItem>
                                ))}
                        </CarouselContent>
                    </Carousel>
                </div>

                <div className="mt-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <span className="font-bold text-gray-800">H&M</span>
                                <span className="text-xs">•</span>
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="font-semibold text-gray-800">{product.rating || 4.9}</span>
                                <span className="text-xs">({product.reviewCount || 136})</span>
                            </div>
                             <h1 className="text-2xl font-bold font-headline mt-1">{product.name}</h1>
                        </div>
                        <Button variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0">
                            <Heart className="h-6 w-6" />
                        </Button>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                         <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">₹{product.currentPrice.toLocaleString('en-IN')}</span>
                            {product.normalPrice > product.currentPrice && (
                                <span className="text-base text-muted-foreground line-through">₹{product.normalPrice.toLocaleString('en-IN')}</span>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                         <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                         <div>
                            <p className="font-semibold mb-2">Colors</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-2 border-primary ring-2 ring-primary/50">
                                    <div className="h-6 w-6 rounded-full bg-blue-900" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-2 border-transparent">
                                     <div className="h-6 w-6 rounded-full bg-blue-500" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-2 border-transparent">
                                     <div className="h-6 w-6 rounded-full bg-sky-200" />
                                </Button>
                            </div>
                        </div>

                        {product.sizes && product.sizes.length > 0 && (
                            <div>
                                <p className="font-semibold mb-2">Size</p>
                                <div className="flex gap-2 flex-wrap">
                                    {product.sizes.map(size => (
                                        <Button 
                                            key={size} 
                                            variant={selectedSize === size ? 'default' : 'outline'}
                                            onClick={() => setSelectedSize(size)}
                                            className="w-12"
                                        >
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-4 border-t bg-background">
                <div className="flex gap-4">
                    <Button variant="outline" className="w-full" size="lg" onClick={() => addToCart(product)}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                    </Button>
                    <Button className="w-full" size="lg" onClick={handleBuyNow}>Buy Now</Button>
                </div>
            </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
