
'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  if (!images || images.length === 0) {
    // Fallback if no images are available
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0 flex aspect-square items-center justify-center bg-muted">
          <Image
            src="https://picsum.photos/seed/placeholder/600/600"
            alt="Placeholder image"
            width={600}
            height={600}
            className="object-cover w-full h-full"
            data-ai-hint="placeholder image"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Carousel className="w-full max-w-lg mx-auto">
      <CarouselContent>
        {images.map((imageUrl, index) => (
          <CarouselItem key={index}>
            <Card className="overflow-hidden">
              <CardContent className="p-0 flex aspect-square items-center justify-center">
                <Image
                  src={imageUrl}
                  alt={`${productName} - image ${index + 1}`}
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                  data-ai-hint="product photo"
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
