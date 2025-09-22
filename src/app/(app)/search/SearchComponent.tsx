
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
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import * as Icons from 'lucide-react';


const DynamicIcon = ({ name }: { name: string }) => {
    const Icon = (Icons as any)[name];
    if (!Icon) {
        return <Icons.ShoppingBag className="h-8 w-8 text-foreground" />;
    }
    return <Icon className="h-8 w-8 text-foreground" />;
};


const filterCategories = [
    { name: 'Bags', icon: 'ShoppingBag' },
    { name: 'Wallets', icon: 'Wallet' },
    { name: 'Footwear', icon: 'Footprints' },
    { name: 'Clothes', icon: 'Shirt' },
    { name: 'Watch', icon: 'Watch' },
    { name: 'Accessories', icon: 'Glasses' },
];

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

export default function SearchComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
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
            // If there's no search query, show some products by default
            return allProducts.slice(0, 10); 
        }
        return allProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, allProducts]);

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 mb-4">
                 <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="relative w-full">
                    <Input
                        type="text"
                        placeholder="Search for products..."
                        className="w-full rounded-md bg-muted py-3 pl-10 pr-4 text-base h-11 focus-visible:ring-primary focus-visible:ring-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                </div>
            </div>
            
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-2 pb-2">
                    <Button variant="outline" className="rounded-full">Filter <ChevronDown className="h-4 w-4 ml-1" /></Button>
                    <Button variant="outline" className="rounded-full">Ratings <ChevronDown className="h-4 w-4 ml-1" /></Button>
                    <Button variant="outline" className="rounded-full">Size <ChevronDown className="h-4 w-4 ml-1" /></Button>
                    <Button variant="outline" className="rounded-full">Color <ChevronDown className="h-4 w-4 ml-1" /></Button>
                    <Button variant="outline" className="rounded-full">Price <ChevronDown className="h-4 w-4 ml-1" /></Button>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            
            <ScrollArea className="w-full whitespace-nowrap py-4">
                <div className="flex space-x-6 pb-2">
                    {filterCategories.map((category) => (
                        <div key={category.name} className="flex flex-col items-center gap-2 flex-shrink-0 w-20">
                            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                               <DynamicIcon name={category.icon} />
                            </div>
                            <p className="text-xs font-medium">{category.name}</p>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>


            {loading ? (
                <SearchSkeleton />
            ) : filteredProducts.length === 0 ? (
                <div className="mt-12 text-center">
                    <Package className="mx-auto h-24 w-24 text-muted-foreground" />
                    <h2 className="mt-6 text-2xl font-semibold">No products found</h2>
                    <p className="mt-2 text-muted-foreground">Your search for "{searchQuery}" did not match any products.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 mt-4">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}
