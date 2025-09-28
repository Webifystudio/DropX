
'use client';

import { useAuth } from '@/context/auth-context';
import { LayoutGrid, Package, Settings, LogOut, Home, Archive, CreditCard, ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';

const sidebarNavItems = [
  { 
    href: '/creator/dashboard', 
    icon: Home, 
    label: 'Overview' 
  },
  { 
    icon: Package, 
    label: 'Products',
    subItems: [
        { href: '/creator/products', label: 'All Products' },
        { href: '/creator/products/add', label: 'Add Product' },
        { href: '/creator/products/drafts', label: 'Drafts', id: 'drafts-link' },
        { href: '/creator/products/bulk-upload', label: 'Bulk Upload' },
    ]
  },
  { 
    icon: Archive, 
    label: 'Inventory',
    subItems: [
        { href: '/creator/inventory', label: 'Stock Overview' },
        { href: '/creator/inventory/low-stock', label: 'Low Stock' },
        { href: '/creator/inventory/out-of-stock', label: 'Out of Stock' },
        { href: '/creator/inventory/adjustments', label: 'Stock Adjustments' },
    ]
  },
  { 
    icon: CreditCard, 
    label: 'Payouts',
    subItems: [
        { href: '/creator/payouts', label: 'Overview' },
        { href: '/creator/payouts/balance', label: 'Balance' },
        { href: '/creator/payouts/request', label: 'Request Withdrawal' },
        { href: '/creator/payouts/history', label: 'Transaction History' },
        { href: '/creator/payouts/accounts', label: 'Payout Accounts' },
    ]
  },
  { 
    icon: Settings, 
    label: 'Settings',
    subItems: [
        { href: '/creator/settings/general', label: 'General' },
        { href: '/creator/settings/payments', label: 'Payments & Payouts' },
        { href: '/creator/settings/shipping', label: 'Shipping' },
        { href: '/creator/settings/taxes', label: 'Taxes & Invoices' },
        { href: '/creator/settings/notifications', label: 'Notifications', id: 'notifications-link' },
        { href: '/creator/settings/security', label: 'Security' },
    ]
  },
];


function NavItem({ item, pathname, draftCount, unreadNotifsCount }: { item: any, pathname: string, draftCount: number, unreadNotifsCount: number }) {
    const isParentActive = item.subItems && item.subItems.some((sub: any) => pathname.startsWith(sub.href));

    if (!item.subItems) {
        const isActive = pathname === item.href;
        return (
            <Link
                href={item.href}
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    isActive && 'bg-muted text-primary font-medium'
                )}
            >
                <item.icon className="h-5 w-5" />
                {item.label}
            </Link>
        );
    }
    
    return (
        <Collapsible defaultOpen={isParentActive}>
            <CollapsibleTrigger className="w-full">
                <div className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    isParentActive && 'text-primary font-medium'
                )}>
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform [&[data-state=open]]:rotate-90" />
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="pl-8 pt-1 flex flex-col gap-1">
                    {item.subItems.map((subItem: any) => {
                        const isSubActive = pathname.startsWith(subItem.href);
                        return (
                            <Link
                                key={subItem.label}
                                href={subItem.href}
                                className={cn(
                                    'flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-primary',
                                    isSubActive && 'bg-muted text-primary font-medium'
                                )}
                            >
                                {subItem.label}
                                {subItem.id === 'drafts-link' && draftCount > 0 && (
                                    <Badge variant="secondary" className="h-5">{draftCount}</Badge>
                                )}
                                {subItem.id === 'notifications-link' && unreadNotifsCount > 0 && (
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [draftCount, setDraftCount] = React.useState(0);
  const [unreadNotifsCount, setUnreadNotifsCount] = React.useState(0);

  React.useEffect(() => {
      if (!user) return;

      const productsQuery = query(
          collection(db, 'products'), 
          where('supplierId', '==', user.uid), // This assumes supplierId is creator UID, might need adjustment
          where('isActive', '==', false)
      );

      const productsUnsubscribe = onSnapshot(productsQuery, (snapshot) => {
          setDraftCount(snapshot.size);
      });

      const notifsQuery = query(
          collection(db, 'creator_notifications'),
          where('creatorId', '==', user.uid),
          where('read', '==', false)
      );
      
      const notifsUnsubscribe = onSnapshot(notifsQuery, (snapshot) => {
          setUnreadNotifsCount(snapshot.size);
      });

      return () => {
          productsUnsubscribe();
          notifsUnsubscribe();
      }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex-shrink-0 flex items-center h-16 px-6 border-b">
            <Link href="/" className="font-bold text-lg">
                DropX Creator
            </Link>
        </div>
        <nav className="flex-grow flex flex-col gap-1 p-2">
          {sidebarNavItems.map((item) => (
            <NavItem key={item.label} item={item} pathname={pathname} draftCount={draftCount} unreadNotifsCount={unreadNotifsCount} />
          ))}
        </nav>
        <div className="mt-auto p-4 border-t">
           <Button onClick={signOut} variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between gap-4 border-b bg-background px-6 md:justify-end">
            <Link href="/" className="font-bold text-lg md:hidden">
                DropX Creator
            </Link>
             <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground hidden sm:block">{user?.email}</p>
                <Avatar>
                  <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                  <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
             </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
