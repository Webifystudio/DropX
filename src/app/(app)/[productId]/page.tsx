
import { getProducts } from '@/lib/products';
import { ProductViewWrapper } from '@/components/products/product-view-wrapper';

type ProductPageProps = {
  params: {
    productId: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const allProducts = await getProducts();
  const product = allProducts.find((p) => p.id === params.productId);

  return <ProductViewWrapper product={product} />;
}
