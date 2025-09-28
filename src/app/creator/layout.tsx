
'use client';

import { useAuth } from '@/context/auth-context';
import { LayoutGrid, Package, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const sidebarNavItems = [
  { href: '/creator/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/creator/orders', icon: Package, label: 'Orders' },
  { href: '/creator/settings', icon: Settings, label: 'Settings' },
];

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex-shrink-0 flex items-center h-16 px-6 border-b">
            <Link href="/" className="font-bold text-lg">
                DropX Creator
            </Link>
        </div>
        <nav className="flex-grow flex flex-col gap-1 p-4">
          {sidebarNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  isActive && 'bg-muted text-primary'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
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
