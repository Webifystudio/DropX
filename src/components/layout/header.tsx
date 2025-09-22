
'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useStore } from '@/context/store-context';
import { Logo } from '../icons';

export default function Header() {
  const { cartCount } = useCart();
  const { store } = useStore();
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href={store ? `/${store.id}`: "/"} className="flex items-center space-x-2">
              <Logo className="h-7 w-7 text-gray-900" />
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-800" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
