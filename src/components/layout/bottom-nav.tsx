
'use client';

import Link from 'next/link';
import { Home, Heart, ShoppingCart, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/cart-context';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart' },
  { href: '/account', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center md:hidden">
        <div className="mx-auto flex items-center space-x-2 rounded-full bg-background p-2 shadow-lg ring-1 ring-black ring-opacity-5">
            {navItems.map((item) => {
                const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));
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
