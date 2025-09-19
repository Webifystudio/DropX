
'use client';

import { products } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProductView } from '@/components/products/product-view';

type ProductPageProps = {
  params: {
    productId: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  // This will be populated once we fetch product data
  const product = products.find((p) => p.id === params.productId);
  
  useEffect(() => {
    if (!isOpen) {
      // Delay to allow the drawer to close before navigating
      setTimeout(() => router.back(), 100);
    }
  }, [isOpen, router]);

  if (!product) {
    // We can show a not found UI or redirect
    // For now, let's just close the modal if product is not found after a delay
    if (typeof window !== 'undefined') {
        // router.back();
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
