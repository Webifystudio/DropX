
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.normalPrice && product.currentPrice ? Math.round(((product.normalPrice - product.currentPrice) / product.normalPrice) * 100) : 0;
  
  // Using a link with scroll={false} to prevent the page from scrolling to the top
  // The actual product view will be handled by the [productId] page which renders the drawer
  return (
    <Link href={`/${product.id}`} scroll={false} className="group block h-full">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardContent className="p-0">
          <div className="relative w-full h-48">
            <Image 
              src={product.images?.[0] || "https://picsum.photos/seed/placeholder/320/240"} 
              alt={product.name} 
              fill
              className="object-cover"
              data-ai-hint="product photo" 
            />
             {discount > 0 && (
                 <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-md">
                    {discount}% OFF
                 </div>
             )}
          </div>
          <div className="p-4 flex-grow flex flex-col">
            <h3 className="text-sm font-semibold mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-grow">{product.description}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">₹{product.currentPrice?.toLocaleString('en-IN')}</span>
              {product.normalPrice && (
                  <span className="text-xs text-muted-foreground line-through">₹{product.normalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
