import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products, categories } from "@/lib/data";
import { ProductList } from "@/components/products/product-list";
import { Search } from "lucide-react";

export default function Home() {
  const recommendedProducts = products.slice(0, 8);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 font-headline">
          Welcome to DropX India
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the best products, curated just for you. Quality and convenience delivered to your doorstep.
        </p>
      </section>

      <section className="mb-12 max-w-2xl mx-auto">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search for products, brands and more..."
            className="h-12 pl-12 pr-4 text-base"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-sm font-medium mr-2">Popular:</span>
          {categories.slice(0, 4).map((category) => (
            <Button key={category.id} variant="outline" size="sm" className="rounded-full">
              {category.name}
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 font-headline">Recommended For You</h2>
        <ProductList products={recommendedProducts} />
      </section>
    </div>
  );
}
