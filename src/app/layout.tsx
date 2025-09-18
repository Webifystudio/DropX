import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottom-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "DropX India",
  description: "Your one-stop shop for everything.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          inter.variable
        )}
      >
        <CartProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <BottomNav />
          </div>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
