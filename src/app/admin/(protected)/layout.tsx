

'use client';

import withAuth from '@/components/auth/with-auth';
import { useAuth } from '@/context/auth-context';
import { LayoutGrid, Package, Plus, Search, Bell, ShoppingCart, Users, Image as ImageIcon, Truck, Store, GitPullRequest } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { AddProductDialog } from '@/components/admin/add-product-dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PushSubscriptionManager } from '@/components/admin/push-subscription-manager';


const sidebarNavItems = [
  { href: '/admin', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/requests', icon: GitPullRequest, label: 'Requests' },
  { href: '/admin/stores', icon: Store, label: 'Stores' },
  { href: '/admin/suppliers', icon: Truck, label: 'Suppliers' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/header', icon: ImageIcon, label: 'Header' },
  { href: '/admin/notifications', icon: Bell, label: 'Notifications' },
];

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadRequestsCount, setUnreadRequestsCount] = useState(0);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.error('Service Worker registration failed:', err);
      });
    }
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), where('read', '==', false));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const q = query(collection(db, 'products'), where('isActive', '==', false));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadRequestsCount(snapshot.size);
    });
    return () => unsubscribe();
  }, []);


  // The dashboard page is at /admin, but the layout is in /admin/(protected)
  // so we need to adjust the href for the check to work correctly
  const getIsActive = (itemHref: string) => {
    if (itemHref === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(itemHref);
  };


  return (
    <div className="flex min-h-screen bg-background relative">
      <aside className="w-16 flex-col bg-card-foreground flex text-primary-foreground">
        <div className="flex-shrink-0 flex items-center justify-center h-16 border-b border-gray-700">
          <LayoutGrid className="h-7 w-7" />
        </div>
        <nav className="flex-grow flex flex-col items-center space-y-2 py-4">
          {sidebarNavItems.map((item) => {
            const isActive = getIsActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'relative p-3 rounded-lg hover:bg-primary/80 transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : ''
                )}
                aria-label={item.label}
              >
                <item.icon className="h-6 w-6" />
                {item.label === 'Notifications' && unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-destructive">
                  </span>
                )}
                 {item.label === 'Orders' && unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
                )}
                {item.label === 'Requests' && unreadRequestsCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-destructive"></span>
                )}
              </Link>
            )
          })}
        </nav>
        <div className="flex-shrink-0 flex flex-col items-center space-y-4 py-4">
            <PushSubscriptionManager />
            <Avatar>
              <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.email || ''} />
              <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

    </div>
  );
}

export default withAuth(AdminLayout, { requiredRole: "akirastreamingzone@gmail.com" });
