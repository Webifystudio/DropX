
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductView } from '@/components/products/product-view';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

type ProductViewWrapperProps = {
  product?: Product;
};

function ProductPageLoader() {
    return (
        <div className="p-4">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="w-full aspect-square mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    )
}

export function ProductViewWrapper({ product }: ProductViewWrapperProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      // Delay to allow the drawer to close before navigating
      setTimeout(() => router.back(), 100);
    }
  }, [isOpen, router]);

  if (!product) {
    if (typeof window !== 'undefined') {
        router.back();
    }
    return null;
  }
  
  return (
      <ProductView 
        product={product} 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
  );
}
