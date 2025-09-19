import { categories } from '@/lib/data';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name }: { name: string }) => {
  const Icon = (Icons as any)[name];
  if (!Icon) {
    return <Icons.ShoppingBag />;
  }
  return <Icon className="h-8 w-8" />;
};

export function Categories() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 font-headline">Shop by Category</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`} className="flex-shrink-0 w-24 text-center group">
              <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/20">
                <DynamicIcon name={category.icon} />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-800">{category.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
