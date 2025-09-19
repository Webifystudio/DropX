
'use client';

import withAuth from '@/components/auth/with-auth';
import { useAuth } from '@/context/auth-context';
import { LayoutGrid, Package, Plus, Search, Bell, ShoppingCart } from 'lucide-react';
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

const sidebarNavItems = [
  { href: '/admin', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/notifications', icon: Bell, label: 'Notifications' },
];

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), where('read', '==', false));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50/50 relative">
      <aside className="w-20 flex-col bg-card border-r flex">
        <div className="flex-shrink-0 flex items-center justify-center h-16">
          <LayoutGrid className="h-7 w-7 text-primary" />
        </div>
        <nav className="flex-grow flex flex-col items-center space-y-2 py-4">
          {sidebarNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'relative p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors',
                  isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground'
                )}
                aria-label={item.label}
              >
                <item.icon className="h-6 w-6" />
                {item.label === 'Notifications' && unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        <div className="flex-shrink-0 flex flex-col items-center space-y-4 py-4">
            <Avatar>
              <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.email || ''} />
              <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-6 border-b bg-card">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-10 w-full"
            />
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      <AddProductDialog>
        <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg">
            <Plus className="h-8 w-8" />
        </Button>
      </AddProductDialog>
    </div>
  );
}

export default withAuth(AdminLayout, { requiredRole: "akirastreamingzone@gmail.com" });
