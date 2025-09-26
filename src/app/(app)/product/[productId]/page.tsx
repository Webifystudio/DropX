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
  const { productId } = params;
  const productData = await getProductById(productId);
  
  if (!productData) {
    notFound();
  }

  // Convert Firestore Timestamps to serializable format (ISO strings)
  const product = {
    ...productData,
    createdAt: productData.createdAt.toDate().toISOString(),
    updatedAt: productData.updatedAt ? productData.updatedAt.toDate().toISOString() : undefined,
  };


  return <ProductView product={product} />;
}
