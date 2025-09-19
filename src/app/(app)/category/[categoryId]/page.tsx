
import { getProducts } from '@/lib/products';
import { categories as allCategories } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/products/product-card';
import { notFound } from 'next/navigation';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type CategoryPageProps = {
    params: {
        categoryId: string;
    };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { categoryId } = params;
    const allProducts = await getProducts();

    const mainCategory = allCategories.find(cat => cat.id === categoryId);

    if (!mainCategory) {
        notFound();
    }

    const subCategoryIds = mainCategory.subCategories.map(sub => sub.id);

    const products = allProducts.filter(product => 
        product.category === categoryId || subCategoryIds.includes(product.category)
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2 font-headline">{mainCategory.name}</h1>
            <p className="text-muted-foreground mb-8">
                Showing {products.length} products
            </p>

            {products.length === 0 ? (
                <div className="text-center py-20">
                    <Package className="mx-auto h-24 w-24 text-muted-foreground" />
                    <h2 className="mt-6 text-2xl font-semibold">No products found</h2>
                    <p className="mt-2 text-muted-foreground">There are no products in this category yet. Check back later!</p>
                    <Button asChild className="mt-6">
                        <Link href="/">Continue Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
