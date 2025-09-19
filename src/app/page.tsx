
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Categories } from "@/components/categories/categories";
import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottom-nav";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
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
              Welcome to DropX India
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
      </main>
      <BottomNav />
    </div>
  );
}
