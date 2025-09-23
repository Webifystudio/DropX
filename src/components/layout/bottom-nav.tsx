
'use client';

import Link from 'next/link';
import { Home, Search, Package, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/cart-context';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/orders', icon: Package, label: 'Orders' },
  { href: '/account', icon: User, label: 'Account' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  // Special handling for store pages to be considered as home
  const isHomePage = (path: string) => {
    if (path === '/') return true;
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 1) {
        const nonStoreRoutes = ['product', 'cart', 'categories', 'category', 'checkout', 'orders', 'search', 'account', 'admin', 'creator', 'privacy-policy', 'terms-of-service', 'contact-us'];
        return !nonStoreRoutes.includes(segments[0]);
    }
    return false;
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center md:hidden">
        <div className="mx-auto flex items-center space-x-2 rounded-full bg-background p-2 shadow-lg ring-1 ring-black ring-opacity-5">
            {navItems.map((item) => {
                const isActive = (item.href === '/' && isHomePage(pathname)) || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                    <Link 
                        key={item.label} 
                        href={item.href} 
                        className={cn(
                            "flex items-center justify-center rounded-full transition-all duration-300 ease-in-out",
                            isActive 
                                ? "h-12 w-auto min-w-[3rem] gap-2 bg-primary/10 px-4 text-primary" 
                                : "h-12 w-12 text-muted-foreground hover:text-primary"
                        )}
                    >
                        <div className="relative">
                            <item.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                            {item.href === '/cart' && cartCount > 0 && (
                                <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        {isActive && <span className="text-sm font-semibold">{item.label}</span>}
                    </Link>
                )
            })}
        </div>
    </div>
  );
}
