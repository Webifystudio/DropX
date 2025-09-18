import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products, categories } from "@/lib/data";
import { ProductList } from "@/components/products/product-list";
import { Search, Star, Smartphone, Shirt, Home as HomeIcon, Heart, Truck, Play, Video, Music } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";

const categoryIcons = {
  Electronics: <Smartphone className="text-blue-600" />,
  Fashion: <Shirt className="text-green-600" />,
  "Home & Kitchen": <HomeIcon className="text-yellow-600" />,
  Beauty: <Heart className="text-purple-600" />,
  Grocery: <Truck className="text-red-600" />,
  "Prime Video": <Play className="text-pink-600" />,
};

const categoryColors = {
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
                  <Star className="text-yellow-300" />
                  <span className="text-sm font-medium">DropX Prime</span>
              </div>
              <a href="#" className="text-xs underline">Try Prime FREE for 30 days</a>
          </div>
      </div>
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8" data-aos="fade-up">
            <h2 className="text-lg font-semibold mb-4">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.entries(categoryIcons).map(([categoryName, icon]) => (
                    <div key={categoryName} className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center">
                        <div className={`p-3 rounded-full mb-2 ${categoryColors[categoryName as keyof typeof categoryColors]}`}>
                            {icon}
                        </div>
                        <span className="text-xs text-center">{categoryName}</span>
                    </div>
                ))}
            </div>
        </section>

        <section className="mb-8" data-aos="fade-up">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Deals of the Day</h2>
                <Link href="#" className="text-sm text-blue-600">See all</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {deals.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
        </section>

        <section className="mb-8" data-aos="fade-up">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Prime Exclusive</h2>
                <Link href="#" className="text-sm text-blue-600">See all</Link>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-bold text-blue-800 mb-2">Prime Member Benefits</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <Truck className="text-blue-600 mr-2 mt-1" />
                                <span className="text-sm">FREE One-Day Delivery on eligible items</span>
                            </li>
                            <li className="flex items-start">
                                <Video className="text-blue-600 mr-2 mt-1" />
                                <span className="text-sm">Unlimited access to Prime Video</span>
                            </li>
                            <li className="flex items-start">
                                <Music className="text-blue-600 mr-2 mt-1" />
                                <span className="text-sm">Ad-free music with Prime Music</span>
                            </li>
                        </ul>
                        <button className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-full text-sm font-medium">Try Prime FREE</button>
                    </div>
                    <div className="flex justify-center">
                        <img src="https://picsum.photos/seed/prime/320/240" alt="Prime" className="h-48 object-contain" data-ai-hint="gadgets technology" />
                    </div>
                </div>
            </div>
        </section>

        <section className="mb-8" data-aos="fade-up">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Trending Products</h2>
                <Link href="#" className="text-sm text-blue-600">See all</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                 {trending.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
        </section>
      </main>
    </>
  );
}
