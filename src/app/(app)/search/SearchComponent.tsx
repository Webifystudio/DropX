
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Package, ArrowLeft, ChevronDown, Heart } from "lucide-react";
import { getProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/products/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { categories as allCategories } from '@/lib/data';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';


const DynamicIcon = ({ name }: { name: string }) => {
    const Icon = (Icons as any)[name];
    if (!Icon) {
        return <Icons.ShoppingBag className="h-8 w-8 text-primary" />;
    }
    return <Icon className="h-8 w-8 text-primary" />;
};


function SearchSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
            {Array.from({ length: 10 }).map((_, i) => (
                 <div key={i} className="space-y-2">
                    <Skeleton className="w-full h-48 rounded-lg" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-6 w-1/2 mt-2" />
                </div>
            ))}
        </div>
    )
}

export default function SearchComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get('q') || '';
    const initialCategory = searchParams.get('category') || '';

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            const products = await getProducts();
            setAllProducts(products);
            setLoading(false);
        }
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        let products = allProducts;
        
        if (selectedCategory) {
            const mainCategory = allCategories.find(cat => cat.id === selectedCategory);
            const subCategoryIds = mainCategory?.subCategories.map(sub => sub.id) || [];
            products = products.filter(product => product.category === selectedCategory || subCategoryIds.includes(product.category));
        }

        if (searchQuery) {
            products = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return products;
    }, [searchQuery, selectedCategory, allProducts]);
    
    const handleCategoryClick = (categoryId: string) => {
        if (selectedCategory === categoryId) {
            setSelectedCategory(''); // Deselect if clicked again
        } else {
            setSelectedCategory(categoryId);
        }
    }
    
    const categories = allCategories.filter(c => c.id !== 'more');

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="relative w-full mb-6">
                <Input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full rounded-full bg-muted py-3 pl-12 pr-4 text-base h-14 border-2 border-transparent focus-visible:border-primary focus-visible:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="flex justify-center overflow-x-auto space-x-4 pb-4 mb-6">
                {categories.map((category) => (
                    <button 
                        key={category.id} 
                        onClick={() => handleCategoryClick(category.id)} 
                        className={cn(
                            "flex-shrink-0 text-center group w-20 transition-all duration-200",
                            selectedCategory === category.id ? "opacity-100" : "opacity-60 hover:opacity-100"
                        )}
                    >
                        <div className={cn(
                            "mx-auto h-16 w-16 flex items-center justify-center overflow-hidden rounded-full transition-all duration-300 group-hover:scale-105 border-2 bg-primary/10 group-hover:bg-primary/20",
                             selectedCategory === category.id ? "border-primary" : "border-transparent"
                        )}>
                            <DynamicIcon name={category.icon} />
                        </div>
                        <p className={cn(
                            "mt-2 text-sm font-medium text-gray-800 truncate",
                            selectedCategory === category.id && "font-bold text-primary"
                        )}>{category.name}</p>
                    </button>
                ))}
            </div>

            {loading ? (
                <SearchSkeleton />
            ) : filteredProducts.length === 0 ? (
                <div className="mt-12 text-center">
                    <Package className="mx-auto h-24 w-24 text-muted-foreground" />
                    <h2 className="mt-6 text-2xl font-semibold">No products found</h2>
                    <p className="mt-2 text-muted-foreground">
                        {searchQuery ? `Your search for "${searchQuery}" did not match any products.` : 'There are no products in this category.'}
                    </p>
                </div>
            ) : (
                <>
                    {searchQuery && (
                        <p className="text-muted-foreground mb-4">
                           Showing {filteredProducts.length} results for <span className="font-bold text-foreground">"{searchQuery}"</span>
                           {selectedCategory && ` in `}
                           {selectedCategory && <span className="font-bold text-foreground">{allCategories.find(c=>c.id === selectedCategory)?.name}</span>}
                        </p>
                    )}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6 mt-4">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
