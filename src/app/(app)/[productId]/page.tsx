
import { getProductById } from '@/lib/products';
import { ProductViewWrapper } from '@/components/products/product-view-wrapper';
import { notFound } from 'next/navigation';

type ProductPageProps = {
  params: {
    productId: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.productId);

  if (!product) {
    notFound();
  }

  return <ProductViewWrapper product={product} />;
}
