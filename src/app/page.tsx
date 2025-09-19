import { HeroSlider } from "@/components/home/hero-slider";
import { products } from "@/lib/data";
import { ProductList } from "@/components/products/product-list";

export default function Home() {
  return (
    <>
      <main>
        <HeroSlider />
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 font-headline">Featured Products</h2>
            <ProductList products={products.slice(0, 4)} />
        </div>
      </main>
    </>
  );
}
