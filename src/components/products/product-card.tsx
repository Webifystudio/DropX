
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart } from 'lucide-react';
import { Button } from '../ui/button';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.normalPrice && product.currentPrice ? Math.round(((product.normalPrice - product.currentPrice) / product.normalPrice) * 100) : 0;
  
  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 border-none shadow-none rounded-lg bg-transparent">
        <CardContent className="p-0">
          <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden">
            <Image 
              src={product.images?.[0] || "https://picsum.photos/seed/placeholder/320/400"} 
              alt={product.name} 
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="product photo" 
            />
            <Button variant="secondary" size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white">
                <Heart className="h-4 w-4" />
            </Button>
          </div>
          <div className="pt-3 flex-grow flex flex-col">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="font-bold text-gray-800">H&M</span>
                <span>•</span>
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-800">{product.rating || 4.8}</span>
                <span>({product.reviewCount || 178})</span>
            </div>
            <h3 className="text-base font-semibold my-1 line-clamp-1">{product.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">₹{product.currentPrice?.toLocaleString('en-IN')}</span>
              {product.normalPrice && product.normalPrice > product.currentPrice && (
                  <span className="text-sm text-muted-foreground line-through">₹{product.normalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
