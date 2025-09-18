import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

function getPlaceholderImage(id: string) {
    const image = PlaceHolderImages.find((img) => img.id === id);
    return image || { imageUrl: 'https://picsum.photos/seed/placeholder/600/600', imageHint: 'placeholder' };
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  return (
    <Carousel className="w-full max-w-lg mx-auto">
      <CarouselContent>
        {images.map((imageId, index) => {
            const { imageUrl, imageHint } = getPlaceholderImage(imageId);
            return (
                <CarouselItem key={index}>
                    <Card className="overflow-hidden">
                    <CardContent className="p-0 flex aspect-square items-center justify-center">
                        <Image
                        src={imageUrl}
                        alt={`${productName} - image ${index + 1}`}
                        width={600}
                        height={600}
                        className="object-cover w-full h-full"
                        data-ai-hint={imageHint}
                        />
                    </CardContent>
                    </Card>
                </CarouselItem>
            )
        })}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
