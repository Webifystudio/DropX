import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';

type ProductCardProps = {
  product: Product;
};

function getPlaceholderImage(id: string) {
    const image = PlaceHolderImages.find((img) => img.id === id);
    return image || { imageUrl: 'https://picsum.photos/seed/placeholder/600/600', imageHint: 'placeholder' };
}


export function ProductCard({ product }: ProductCardProps) {
  const { imageUrl, imageHint } = getPlaceholderImage(product.images[0]);

  return (
    <Link href={`/${product.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              width={600}
              height={600}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={imageHint}
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium text-base truncate group-hover:text-primary">{product.name}</h3>
            <div className="flex items-center justify-between mt-2">
              <p className="font-bold text-lg">₹{product.price.toLocaleString('en-IN')}</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-muted-foreground">{product.rating}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
