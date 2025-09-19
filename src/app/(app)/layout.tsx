
'use client';

import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottom-nav";
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
    const segments = pathname.split('/').filter(Boolean);
    const potentialStoreId = segments[0];
    
    // A list of top-level routes that are NOT stores
    const nonStoreRoutes = ['product', 'cart', 'categories', 'category', 'checkout', 'orders', 'search', 'account', 'admin', 'creator'];

    async function fetchStore() {
        if (potentialStoreId && !nonStoreRoutes.includes(potentialStoreId)) {
            const fetchedStore = await getStore(potentialStoreId);
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
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <BottomNav />
        </div>
    </StoreProvider>
  );
}
