
'use client';

import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottom-nav";
import { CartProvider } from "@/context/cart-context";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <BottomNav />
      </div>
    </CartProvider>
  );
}
