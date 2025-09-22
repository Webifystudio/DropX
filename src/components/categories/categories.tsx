
import { categories } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name }: { name: string }) => {
  const Icon = (Icons as any)[name];
  if (!Icon) {
    // Fallback Icon
    return <Icons.ShoppingBag className="h-8 w-8 text-primary" />;
  }
  return <Icon className="h-8 w-8 text-primary" />;
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
            <Link key={category.id} href={`/category/${category.id}`} className="flex-shrink-0 text-center group w-20">
              <div className="mx-auto h-16 w-16 flex items-center justify-center overflow-hidden rounded-full transition-all duration-300 group-hover:scale-105 border-2 bg-primary/10 group-hover:bg-primary/20 group-hover:border-primary">
                <DynamicIcon name={category.icon} />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-800 truncate">{category.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
