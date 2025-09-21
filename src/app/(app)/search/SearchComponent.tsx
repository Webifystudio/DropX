
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Package } from "lucide-react";
import { getProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/products/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';

function SearchSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
            {Array.from({ length: 10 }).map((_, i) => (
                 <Card key={i}>
                    <CardContent className="p-0">
                    <Skeleton className="w-full h-48" />
                    <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-6 w-1/2 mt-2" />
                    </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

// Dummy Card for skeleton
const Card = ({children, ...props}: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>
const CardContent = ({children, ...props}: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>


export default function SearchComponent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
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
        if (!searchQuery) {
            return [];
        }
        return allProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, allProducts]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="relative mx-auto max-w-xl">
                <Input
                    type="text"
                    placeholder="Search for products, brands and more..."
                    className="w-full rounded-full bg-muted py-3 pl-12 pr-4 text-base h-12 focus-visible:ring-primary focus-visible:ring-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
            </div>

            {loading ? (
                <SearchSkeleton />
            ) : searchQuery && filteredProducts.length === 0 ? (
                <div className="mt-12 text-center">
                    <Package className="mx-auto h-24 w-24 text-muted-foreground" />
                    <h2 className="mt-6 text-2xl font-semibold">No products found</h2>
                    <p className="mt-2 text-muted-foreground">Your search for "{searchQuery}" did not match any products.</p>
                </div>
            ) : searchQuery && filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                 <div className="mt-12 text-center">
                    <p className="text-muted-foreground">Search for your favorite products.</p>
                </div>
            )}
        </div>
    )
}
