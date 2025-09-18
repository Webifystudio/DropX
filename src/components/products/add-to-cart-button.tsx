'use client';

import { useCart } from '@/context/cart-context';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

type AddToCartButtonProps = {
  product: Product;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <Button size="lg" className="w-full" onClick={() => addToCart(product)}>
      <ShoppingCart className="mr-2 h-5 w-5" />
      Add to Cart
    </Button>
  );
}
