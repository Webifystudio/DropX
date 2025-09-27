
'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react';
import { cn } from '@/lib/utils';

type ProductImageGalleryClientProps = {
  images: string[];
  productName: string;
};

export function ProductImageGalleryClient({ images, productName }: ProductImageGalleryClientProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const resolvedImages = images.length > 0 ? images : ["https://picsum.photos/seed/placeholder/600/600"];

  return (
    <div className="bg-background p-4">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {resolvedImages.map((imageUrl, index) => (
            <div className="relative flex-[0_0_100%] aspect-square" key={index}>
              <Image
                src={imageUrl}
                alt={`${productName} - image ${index + 1}`}
                fill
                className="object-contain"
                data-ai-hint="product photo"
              />
            </div>
          ))}
        </div>
      </div>

      {resolvedImages.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {resolvedImages.map((imageUrl, index) => (
            <button key={index} onClick={() => onThumbClick(index)} className="aspect-square relative">
              <Image
                src={imageUrl}
                alt={`Thumbnail ${index + 1}`}
                fill
                className={cn(
                  'object-cover rounded-md transition-opacity',
                  index === selectedIndex ? 'opacity-100' : 'opacity-50'
                )}
              />
              <div
                className={cn(
                  'absolute inset-0 rounded-md border-2 transition-all',
                  index === selectedIndex ? 'border-primary' : 'border-transparent'
                )}
              ></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
