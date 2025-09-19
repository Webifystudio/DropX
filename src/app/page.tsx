import { products, categories } from '@/lib/data';
import { ProductList } from '@/components/products/product-list';
import {
  Star,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Heart,
  Truck,
  Play,
  Video,
  Music,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const categoryIcons: { [key: string]: React.ReactElement } = {
  Electronics: <Smartphone />,
  Fashion: <Shirt />,
  'Home & Kitchen': <HomeIcon />,
  Beauty: <Heart />,
  Grocery: <Truck />,
  'Prime Video': <Play />,
};

export default function Home() {
  const deals = products.slice(0, 4);
  const trending = products.slice(4, 8);

  return (
    <>
      <div className="bg-gradient-to-r from-primary/90 to-primary text-white py-2 px-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="text-yellow-300 w-4 h-4 fill-yellow-300" />
            <span className="text-sm font-medium">DropX Prime</span>
          </div>
          <Link href="#" className="text-xs underline">
            Try Prime FREE for 30 days
          </Link>
        </div>
      </div>
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <section className="mb-8" data-aos="fade-up">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-headline">
                  Welcome to DropX India
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your one-stop shop for the best deals on top brands.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/categories"
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-md"
                  >
                    Shop Now
                  </Link>
                  <Link
                    href="#"
                    className="bg-white text-primary border border-primary/20 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/5 transition-all"
                  >
                    Top Deals
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <Image
                  src="https://picsum.photos/seed/welcome/350/280"
                  alt="Welcome"
                  width={350}
                  height={280}
                  className="h-auto w-full max-w-sm object-contain rounded-lg"
                  data-ai-hint="shopping modern"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-8" data-aos="fade-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Shop by Category</h2>
            <Link href="/categories" className="text-sm text-primary font-medium">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((category) => (
              <Link
                href={`/category/${category.id}`}
                key={category.id}
                className="bg-card rounded-xl p-3 shadow-sm flex flex-col items-center justify-center aspect-square transition-transform hover:scale-105 border border-transparent hover:border-primary/30"
              >
                <div className="p-3 rounded-full mb-2 bg-primary/10 text-primary">
                  {categoryIcons[category.name] || <HomeIcon />}
                </div>
                <span className="text-xs text-center font-medium text-muted-foreground group-hover:text-primary">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Deals of the Day */}
        <section className="mb-8" data-aos="fade-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Deals of the Day</h2>
            <Link href="#" className="text-sm text-primary font-medium">
              See all
            </Link>
          </div>
          <ProductList products={deals} />
        </section>

        {/* Prime Exclusive */}
        <section className="mb-8" data-aos="fade-up">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-2 font-headline">
                  Prime Member Benefits
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Truck className="text-primary mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      FREE One-Day Delivery on eligible items
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Video className="text-primary mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Unlimited access to Prime Video
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Music className="text-primary mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Ad-free music with Prime Music
                    </span>
                  </li>
                </ul>
                <button className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-md">
                  Try Prime FREE
                </button>
              </div>
              <div className="flex justify-center">
                <Image
                  src="https://picsum.photos/seed/prime/320/240"
                  alt="Prime"
                  width={320}
                  height={240}
                  className="h-48 w-auto object-contain rounded-lg"
                  data-ai-hint="gadgets technology"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trending Products */}
        <section className="mb-8" data-aos="fade-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Trending Products</h2>
            <Link href="#" className="text-sm text-primary font-medium">
              See all
            </Link>
          </div>
          <ProductList products={trending} />
        </section>
      </main>
    </>
  );
}
