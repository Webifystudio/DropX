import {
  Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
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
      </main>
    </>
  );
}
