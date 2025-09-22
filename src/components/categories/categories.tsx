
import { categories } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const categoryImages: { [key: string]: string } = {
    "electronics": "https://i.ibb.co/VvZqV64/cat-electronics.png",
    "apparel-clothing": "https://i.ibb.co/b3vTJnB/cat-women.png",
    "home-goods": "https://i.ibb.co/ZKYcW1G/cat-home.png",
    "health-beauty": "https://i.ibb.co/Y05r2fx/cat-beauty.png",
    "sports-outdoors": "https://i.ibb.co/RSCW40W/cat-sports.png",
    "books-media": "https://i.ibb.co/VvZqV64/cat-electronics.png",
    "more": "https://i.ibb.co/VvZqV64/cat-electronics.png",
};


export function Categories() {
  const displayCategories = categories.filter(c => c.id !== 'more').slice(0, 5);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-headline">Shop by Category</h2>
            <Button variant="link" asChild>
                <Link href="/categories">See All</Link>
            </Button>
        </div>
        <div className="flex justify-between overflow-x-auto space-x-4 pb-4">
          {displayCategories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`} className="flex-shrink-0 text-center group">
              <div className="mx-auto h-16 w-16 relative overflow-hidden rounded-full transition-all duration-300 group-hover:scale-105 border-2 border-transparent group-hover:border-primary">
                <Image src={categoryImages[category.id] || "https://picsum.photos/seed/cat/100/100"} alt={category.name} fill className="object-cover" data-ai-hint="fashion category" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-800">{category.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
