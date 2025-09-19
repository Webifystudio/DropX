
import { products, reviews as allReviews } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { AddToCartButton } from '@/components/products/add-to-cart-button';
import { ProductList } from '@/components/products/product-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type ProductPageProps = {
  params: {
    productId: string;
  };
};

export async function generateStaticParams() {
  return products.map((product) => ({
    productId: product.id,
  }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.id === params.productId);

  if (!product) {
    notFound();
  }
  
  const productReviews = allReviews.filter(r => r.productId === product.id);
  const relatedProducts = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <ProductImageGallery images={product.images} productName={product.name} />
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold font-headline">{product.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          <div className="mt-4">
              <AddToCartButton product={product} />
          </div>

          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold">Product Details</h3>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 text-sm">
                <li>Free Delivery</li>
                <li>Easy 30-day returns</li>
                <li>1 Year Warranty</li>
            </ul>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 font-headline">Customer Reviews</h2>
            <Card>
                <CardContent className="p-6 space-y-6">
                    {productReviews.length > 0 ? productReviews.map(review => (
                        <div key={review.id}>
                            <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold">{review.author}</p>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-muted-foreground">{review.text}</p>
                        </div>
                    )) : (
                        <p className="text-muted-foreground">No reviews for this product yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
      
      <Separator className="my-12" />

      <div>
        <h2 className="text-2xl font-bold mb-6 font-headline">Related Products</h2>
        <ProductList products={relatedProducts} />
      </div>
    </div>
  );
}
