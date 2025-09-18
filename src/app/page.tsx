import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products, categories } from "@/lib/data";
import { ProductList } from "@/components/products/product-list";
import { Search, Star, Smartphone, Shirt, Home as HomeIcon, Heart, Truck, Play, Video, Music } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { Card, CardContent } from "@/components/ui/card";

const categoryIcons: { [key: string]: React.ReactElement } = {
  Electronics: <Smartphone className="text-blue-600" />,
  Fashion: <Shirt className="text-green-600" />,
  "Home & Kitchen": <HomeIcon className="text-yellow-600" />,
  Beauty: <Heart className="text-purple-600" />,
  Grocery: <Truck className="text-red-600" />,
  "Prime Video": <Play className="text-pink-600" />,
};

const categoryColors: { [key: string]: string } = {
    Electronics: "bg-blue-100",
    Fashion: "bg-green-100",
    "Home & Kitchen": "bg-yellow-100",
    Beauty: "bg-purple-100",
    Grocery: "bg-red-100",
    "Prime Video": "bg-pink-100",
}

const deals = products.slice(0, 4);
const trending = products.slice(4, 8);


export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-2 px-4">
          <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-2">
                  <Star className="text-yellow-300 w-4 h-4 fill-yellow-300" />
                  <span className="text-sm font-medium">DropX Prime</span>
              </div>
              <a href="#" className="text-xs underline">Try Prime FREE for 30 days</a>
          </div>
      </div>
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8" data-aos="fade-up">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-6 text-center">
                    <h2 className="text-3xl font-bold text-blue-800 font-headline">Welcome to DropX</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Your destination for the latest trends and top products. Discover unbeatable deals and find your next favorite item today.</p>
                </CardContent>
            </Card>
        </section>

        <section className="mb-8" data-aos="fade-up">
            <h2 className="text-lg font-semibold mb-4">Shop by Category</h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center justify-center aspect-square transition-transform hover:scale-105">
                        <div className={`p-3 rounded-full mb-2 ${categoryColors[category.name] || 'bg-gray-100'}`}>
                            {categoryIcons[category.name] || <HomeIcon className="text-gray-600" />}
                        </div>
                        <span className="text-xs text-center font-medium">{category.name}</span>
                    </div>
                ))}
            </div>
        </section>

        <section className="mb-8" data-aos="fade-up">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Deals of the Day</h2>
                <Link href="#" className="text-sm text-blue-600 hover:underline">See all</Link>
            </div>
            <ProductList products={deals} />
        </section>

        <section className="mb-8" data-aos="fade-up">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Prime Exclusive</h2>
                <Link href="#" className="text-sm text-blue-600 hover:underline">See all</Link>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h3 className="text-xl font-bold text-blue-800 mb-2 font-headline">Prime Member Benefits</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <Truck className="text-blue-600 mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                                <span className="text-sm">FREE One-Day Delivery on eligible items</span>
                            </li>
                            <li className="flex items-start">
                                <Video className="text-blue-600 mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                                <span className="text-sm">Unlimited access to Prime Video</span>
                            </li>
                            <li className="flex items-start">
                                <Music className="text-blue-600 mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                                <span className="text-sm">Ad-free music with Prime Music</span>
                            </li>
                        </ul>
                        <button className="mt-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-blue-700 hover:to-blue-900 transition-all">Try Prime FREE</button>
                    </div>
                    <div className="flex justify-center">
                        <img src="https://picsum.photos/seed/prime/320/240" alt="Prime" className="h-48 object-contain rounded-lg" data-ai-hint="gadgets technology" />
                    </div>
                </div>
            </div>
        </section>

        <section className="mb-8" data-aos="fade-up">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Trending Products</h2>
                <Link href="#" className="text-sm text-blue-600 hover:underline">See all</Link>
            </div>
            <ProductList products={trending} />
        </section>
      </main>
    </>
  );
}
