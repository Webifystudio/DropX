
import { getProductById } from '@/lib/products';
import { ProductView } from '@/components/products/product-view';
import { notFound } from 'next/navigation';
import type { Store } from '@/lib/types';

type ProductPageProps = {
  params: {
    productId: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.productId);
  let store: Store | null = null;
  if (product) {
    // This is a simplification. In a real app you might have a different way
    // to associate a product with a store if a product can be in multiple stores.
    // For now, we assume a product belongs to the first store that lists it.
    // Or, more realistically, we'd pass the storeId in the params.
    // Let's assume for now we don't need store context on the product page itself,
    // but if we did, we'd need to pass it.
  }

  if (!product) {
    notFound();
  }

  return <ProductView product={product} />;
}
