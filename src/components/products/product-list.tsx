import type { Product } from '@/lib/types';
import { ProductCard } from './product-card';

type ProductListProps = {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
