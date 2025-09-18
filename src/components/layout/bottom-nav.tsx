'use client';

import Link from 'next/link';
import { Home, Grid, User, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/categories', icon: Grid, label: 'Categories' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/account', icon: User, label: 'Account' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-gray-200 z-50 md:hidden">
        <div className="container mx-auto px-4">
            <div className="flex justify-around py-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.label} href={item.href} className={cn(
                            "flex flex-col items-center justify-center text-gray-600 transition-colors w-16",
                            isActive ? "text-primary" : "hover:text-primary"
                        )}>
                            <div className="relative">
                                <item.icon className={cn("w-6 h-6 transition-transform", isActive ? "scale-110" : "")} />
                                {isActive && (
                                    <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 h-1 w-1 bg-primary rounded-full"></span>
                                )}
                            </div>
                            <span className="text-xs mt-1.5">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    </nav>
  );
}
