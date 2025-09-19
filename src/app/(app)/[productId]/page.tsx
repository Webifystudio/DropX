
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductView } from '@/components/products/product-view';
import { getProducts } from '@/lib/products';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

type ProductPageProps = {
  params: {
    productId: string;
  };
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


export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const allProducts = await getProducts();
      const foundProduct = allProducts.find((p) => p.id === params.productId);
      setProduct(foundProduct || null);
      setLoading(false);
    };
    fetchProduct();
  }, [params.productId]);
  
  useEffect(() => {
    if (!isOpen) {
      // Delay to allow the drawer to close before navigating
      setTimeout(() => router.back(), 100);
    }
  }, [isOpen, router]);

  if (loading) {
    // This is primarily for client-side navigation.
    // On first load, data should be streamed from the server component.
    return <ProductPageLoader />;
  }

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
