
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { AddProductForm } from '@/components/creator/add-product-form';
import { getProductById } from '@/lib/products';
import { Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type EditProductPageProps = {
    params: {
        productId: string;
    };
};

function EditProductPage({ params }: EditProductPageProps) {
    const { productId } = params;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            const productData = await getProductById(productId);
            if (productData) {
                setProduct(productData);
            } else {
                notFound();
            }
            setLoading(false);
        }
        fetchProduct();
    }, [productId]);


    if (loading) {
        return <Skeleton className="h-[500px] w-full" />
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">Edit Product</h1>
                <p className="text-muted-foreground">Update the details for your product below.</p>
            </div>
            
            <AddProductForm product={product || undefined} />

        </div>
    );
}

export default withCreatorAuth(EditProductPage);
