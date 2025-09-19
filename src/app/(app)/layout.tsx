
'use client';

import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottom-nav";
import { CartProvider } from "@/context/cart-context";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStore } from '@/lib/stores';
import type { Store } from '@/lib/types';
import { StoreProvider } from '@/context/store-context';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storeId = pathname.split('/')[1];
    
    async function fetchStore() {
        if (storeId && storeId !== 'product' && storeId !== 'cart' && storeId !== 'categories' && storeId !== 'category' && storeId !== 'checkout' && storeId !== 'orders' && storeId !== 'search' && storeId !== 'account' ) {
            const fetchedStore = await getStore(storeId);
            setStore(fetchedStore);
        } else {
            setStore(null);
        }
        setLoading(false);
    }

    fetchStore();
  }, [pathname]);

  return (
    <StoreProvider store={store}>
      <CartProvider>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <BottomNav />
        </div>
      </CartProvider>
    </StoreProvider>
  );
}
