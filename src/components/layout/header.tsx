
'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Rocket, LayoutGrid } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useStore } from '@/context/store-context';
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Header() {
  const { cartCount } = useCart();
  const { store } = useStore();
  const { user } = useAuth();
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    async function checkCreatorStatus() {
      if (user) {
        const storeDocRef = doc(db, 'stores', user.uid);
        const docSnap = await getDoc(storeDocRef);
        setIsCreator(docSnap.exists());
      } else {
        setIsCreator(false);
      }
    }
    checkCreatorStatus();
  }, [user]);
  
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href={store ? `/${store.id}`: "/"} className="flex items-center space-x-2">
              <span className="font-bold text-xl">{store?.id || process.env.NEXT_PUBLIC_SITE_NAME || 'DropX'}</span>
          </Link>
          
          <div className="flex items-center space-x-2">
             {isCreator ? (
                <Link href="/creator/dashboard" className="relative p-2">
                  <LayoutGrid className="h-6 w-6 text-foreground" />
                </Link>
             ) : (
                <Link href="/creator" className="relative p-2">
                  <Rocket className="h-6 w-6 text-foreground" />
                </Link>
             )}
            <Link href="/search" className="relative p-2">
              <Search className="h-6 w-6 text-foreground" />
            </Link>
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
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
