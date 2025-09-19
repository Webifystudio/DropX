
import { categories as allCategories } from '@/lib/data';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name }: { name: string }) => {
  const Icon = (Icons as any)[name];
  if (!Icon) {
    return <Icons.ShoppingBag />;
  }
  return <Icon className="h-10 w-10 text-primary" />;
};


export default function CategoriesPage() {
    // Exclude the 'more' category from the grid
    const categories = allCategories.filter(c => c.id !== 'more');

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 font-headline">All Categories</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                    <Link key={category.id} href={`/category/${category.id}`}>
                        <Card className="group hover:border-primary transition-all duration-300">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <div className="mb-4">
                                    <DynamicIcon name={category.icon} />
                                </div>
                                <h3 className="font-semibold text-lg">{category.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Shop Now <ArrowRight className="inline h-4 w-4" />
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
