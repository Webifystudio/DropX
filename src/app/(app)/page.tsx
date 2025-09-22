
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Categories } from "@/components/categories/categories";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { categories as allCategories } from "@/lib/data";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { HeroSectionConfig } from "@/lib/types";

async function getHeroConfig(): Promise<HeroSectionConfig | null> {
  try {
    const docRef = doc(db, 'site_config', 'hero_section');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as HeroSectionConfig;
    }
    return null;
  } catch (error) {
    console.error("Error fetching hero config:", error);
    return null;
  }
}

export default async function Home() {
  const products = await getProducts();
  const heroConfig = await getHeroConfig();
  
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
    <div className="bg-background">
        <section className="container mx-auto px-4 pt-6">
          <div className="relative rounded-lg overflow-hidden bg-gray-200 aspect-[2/1] md:aspect-[3/1]">
            <Image
              src={heroConfig?.imageUrl || "https://i.ibb.co/p1B9gq2/banner.png"}
              alt="New Collections"
              fill
              className="w-full h-full object-cover"
              data-ai-hint="fashion sale"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent">
              {heroConfig ? (
                <>
                  <h2 className="text-xl font-bold text-white">{heroConfig.heading}</h2>
                  <p className="text-4xl font-extrabold text-white">{heroConfig.subheading}</p>
                   <Button asChild className="mt-2 w-fit bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 h-auto text-sm">
                    <Link href={heroConfig.link}>{heroConfig.buttonText}</Link>
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-white">NEW COLLECTIONS</h2>
                  <p className="text-4xl font-extrabold text-white">20% <span className="text-2xl font-bold">OFF</span></p>
                   <Button asChild className="mt-2 w-fit bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 h-auto text-sm">
                    <Link href="/categories">Shop Now</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        <Categories />

        <div className="space-y-12">
            {Object.entries(productsByCategory).map(([categoryId, products]) => {
                const categoryInfo = categoryDetails[categoryId];
                return (
                    <section key={categoryId}>
                        <div className="container mx-auto px-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold font-headline">{categoryInfo?.name || categoryId}</h2>
                                <Button variant="link" asChild>
                                    <Link href={`/category/${categoryInfo?.id || categoryId}`}>See All</Link>
                                </Button>
                            </div>
                           <div className="grid grid-cols-2 gap-4">
                                {products.slice(0,4).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    </section>
                )
            })}
        </div>

    </div>
  );
}
