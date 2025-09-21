
'use client';

import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottom-nav";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStore } from '@/lib/stores';
import type { Store } from '@/lib/types';
import { StoreProvider } from '@/context/store-context';
import Footer from "@/components/layout/footer";

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
    
    const nonStoreRoutes = ['product', 'cart', 'categories', 'category', 'checkout', 'orders', 'search', 'account', 'admin', 'creator', 'privacy-policy', 'terms-of-service', 'contact-us'];

    async function fetchStore() {
        let currentStore: Store | null = null;
        if (potentialStoreId && !nonStoreRoutes.includes(potentialStoreId)) {
            const fetchedStore = await getStore(potentialStoreId);
            if (fetchedStore) {
                currentStore = fetchedStore;
                localStorage.setItem('currentStore', JSON.stringify(fetchedStore));
            }
        } else {
             const savedStore = localStorage.getItem('currentStore');
             if (savedStore) {
                currentStore = JSON.parse(savedStore);
             }
        }
        setStore(currentStore);
        setLoading(false);
    }

    fetchStore();
  }, [pathname]);

  return (
    <StoreProvider store={store}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
        </div>
    </StoreProvider>
  );
}
