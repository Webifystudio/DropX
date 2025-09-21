
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Categories } from "@/components/categories/categories";
import { getProducts } from "@/lib/products";
import { ProductList } from "@/components/products/product-list";
import { categories as allCategories } from "@/lib/data";

export default async function Home() {
  const products = await getProducts();
  
  const productsByCategory: { [key: string]: any[] } = {};
  const categoryDetails: { [key: string]: { name: string, id: string } } = {};

  allCategories.forEach(mainCat => {
      mainCat.subCategories.forEach(subCat => {
          categoryDetails[subCat.id] = { name: subCat.name, id: mainCat.id };
      });
  });

  products.forEach(product => {
    if (product.category) {
      if (!productsByCategory[product.category]) {
        productsByCategory[product.category] = [];
      }
      productsByCategory[product.category].push(product);
    }
  });


  return (
    <>
        <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-white">
          <Image
            src="https://picsum.photos/seed/home-hero/1920/1080"
            alt="Hero background"
            fill
            className="object-cover"
            data-ai-hint="online shopping"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center p-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
              Welcome to {process.env.NEXT_PUBLIC_SITE_NAME || 'DropX'} India
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-8">
              Your one-stop shop for everything you need.
            </p>
            <Button asChild size="lg">
              <Link href="/categories">Shop Now</Link>
            </Button>
          </div>
        </section>

        <Categories />

        <div className="py-8 space-y-12">
            {Object.entries(productsByCategory).map(([categoryId, products]) => {
                const categoryInfo = categoryDetails[categoryId];
                return (
                    <section key={categoryId}>
                        <div className="container mx-auto px-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold font-headline">{categoryInfo?.name || categoryId}</h2>
                                <Button variant="link" asChild>
                                    <Link href={`/category/${categoryInfo?.id || categoryId}`}>View All</Link>
                                </Button>
                            </div>
                           <ProductList products={products} />
                        </div>
                    </section>
                )
            })}
        </div>

    </>
  );
}
