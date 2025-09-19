
import type { Product } from '@/lib/types';
import { ProductCard } from './product-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type ProductListProps = {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  return (
    <ScrollArea>
        <div className="flex space-x-4 pb-4">
            {products.map((product) => (
                <div key={product.id} className="w-64 flex-shrink-0">
                     <ProductCard product={product} />
                </div>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
