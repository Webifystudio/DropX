'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Menu className="text-gray-600 md:hidden" />
                    <Link href="/" className="flex items-center space-x-2">
                        <h1 className="text-xl font-bold text-blue-600">DropX</h1>
                        <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">India</span>
                    </Link>
                </div>
                
                <div className="relative flex-1 mx-4">
                    <Input type="text" placeholder="Search for products..." 
                           className="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                </div>
                
                <div className="flex items-center space-x-4">
                    <Link href="/cart" className="relative">
                        <ShoppingCart className="text-gray-600" />
                        {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>}
                    </Link>
                    <Link href="/account">
                        <User className="text-gray-600" />
                    </Link>
                </div>
            </div>
        </div>
    </header>
  );
}
