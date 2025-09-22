
'use client';

import Link from 'next/link';
import { Home, Search, Bell, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Explore' },
  { href: '/orders', icon: Bell, label: 'Orders' },
  { href: '/account', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-gray-200 z-50 md:hidden">
        <div className="container mx-auto px-4">
            <div className="flex justify-around py-2">
                {navItems.map((item) => {
                    const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link key={item.label} href={item.href} className={cn(
                            "flex flex-col items-center justify-center text-gray-500 transition-colors w-16 py-1",
                            isActive ? "text-primary" : "hover:text-primary"
                        )}>
                            <div className="relative">
                                <item.icon className={cn("w-6 h-6 transition-transform", isActive ? "scale-110" : "")} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={cn("text-xs mt-1", isActive ? "font-semibold" : "font-normal")}>{item.label}</span>
                             {isActive && (
                                <span className="absolute bottom-0 h-0.5 w-8 bg-primary rounded-full"></span>
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    </nav>
  );
}
