'use client';

import Link from 'next/link';
import { Home, Search, ShoppingCart, Package } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Badge } from '../ui/badge';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart' },
  { href: '/orders', icon: Package, label: 'Orders' },
];

export default function BottomNav() {
  const { cartCount } = useCart();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-muted group",
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div className="relative">
                <item.icon className="w-6 h-6 mb-1" />
                {item.href === '/cart' && cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -right-3 -top-1 h-5 w-5 justify-center rounded-full p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
