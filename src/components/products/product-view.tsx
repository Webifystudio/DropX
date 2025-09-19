
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Drawer } from 'vaul';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { ArrowLeft, Heart, Share, Star } from 'lucide-react';
import { AddToCartButton } from './add-to-cart-button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel"
import { useCart } from '@/context/cart-context';
import { useState } from 'react';

type ProductViewProps = {
  product: Product;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};


export function ProductView({ product, isOpen, setIsOpen }: ProductViewProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');

  const discount = product.normalPrice && product.currentPrice ? Math.round(((product.normalPrice - product.currentPrice) / product.normalPrice) * 100) : 0;

  const handleBuyNow = () => {
    addToCart(product);
    router.push('/checkout');
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 z-50">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-2" />
            <div className="p-4 bg-background flex-1 overflow-y-auto">
                <Drawer.Title className="sr-only">{product.name}</Drawer.Title>
                <div className="sticky top-0 bg-background py-2 -mt-4 z-10">
                    <div className="flex justify-between items-center">
                         <Drawer.Close asChild>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft />
                            </Button>
                         </Drawer.Close>
                         <div className="flex items-center gap-2">
                             <Button variant="outline" size="icon">
                                 <Heart className="h-5 w-5" />
                             </Button>
                             <Button variant="outline" size="icon">
                                 <Share className="h-5 w-5" />
                             </Button>
                         </div>
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
                             {discount > 0 && <Badge variant="destructive" className="mb-2">-{discount}% OFF</Badge>}
                             <p className="text-sm text-muted-foreground">WinterElegance</p>
                             <h1 className="text-2xl font-bold font-headline">{product.name}</h1>
                        </div>
                        <div className="flex items-center gap-1 text-right">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold">{product.rating || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                         <div>
                            <span className="text-2xl font-bold text-primary">₹{product.currentPrice.toLocaleString('en-IN')}</span>
                            {product.normalPrice > product.currentPrice && (
                                <span className="text-sm text-muted-foreground line-through ml-2">₹{product.normalPrice.toLocaleString('en-IN')}</span>
                            )}
                        </div>
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mt-6">
                            <p className="font-semibold mb-2">Size</p>
                            <div className="flex gap-2 flex-wrap">
                                {product.sizes.map(size => (
                                    <Button 
                                        key={size} 
                                        variant={selectedSize === size ? 'default' : 'outline'}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}


                    <div className="mt-6">
                         <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>
                    </div>

                </div>
            </div>
            <div className="p-4 border-t bg-background">
                <div className="flex gap-4">
                    <AddToCartButton product={product} />
                    <Button className="w-full" size="lg" onClick={handleBuyNow}>Buy Now</Button>
                </div>
            </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
