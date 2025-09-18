'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Package } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/icons';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 hidden w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-bold">DropX India</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Home
          </Link>
          <Link href="/#categories" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Categories
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <form>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search products..." className="w-full pl-9 md:w-[200px] lg:w-[320px]" />
              </div>
            </form>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/orders">
              <Package className="h-5 w-5" />
              <span className="sr-only">My Orders</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0">
                    {cartCount}
                  </Badge>
                )}
              </div>
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
