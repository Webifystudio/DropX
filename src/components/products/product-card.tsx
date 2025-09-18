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
    return image || { imageUrl: `https://picsum.photos/seed/${id}/320/240`, imageHint: 'product photo' };
}

export function ProductCard({ product }: ProductCardProps) {
  const { imageUrl, imageHint } = getPlaceholderImage(product.images[0]);
  const discount = Math.round((1 - product.price / (product.price * 1.25)) * 100);

  return (
    <Link href={`/${product.id}`} className="group block">
      <div className="bg-white rounded-lg p-4 shadow-sm product-card">
          <div className="relative mb-3">
              <Image src={imageUrl} alt={product.name} width={320} height={240} className="w-full h-40 object-contain" data-ai-hint={imageHint} />
              {product.id === 'prod-1' || product.id === 'prod-5' ? <div className="absolute top-2 left-2 prime-badge text-white text-xs px-2 py-1 rounded">Prime</div> : null}
          </div>
          <h3 className="text-sm font-medium mb-1 line-clamp-2">{product.name}</h3>
          <div className="flex items-center mb-1">
              <div className="flex text-yellow-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                  ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
          </div>
          <div className="flex items-end">
              <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="text-xs text-gray-500 line-through ml-2">₹{(product.price * 1.25).toLocaleString('en-IN')}</span>
              <span className="text-xs text-green-600 ml-2">{discount}% off</span>
          </div>
      </div>
    </Link>
  );
}
