
'use client';

import type { Product } from '@/lib/types';
import { ProductCard } from './product-card';

type ProductListProps = {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  return (
    <>
        {products.map((product) => (
            <div key={product.id} className="w-48 flex-shrink-0">
                    <ProductCard product={product} />
            </div>
        ))}
    </>
  );
}
