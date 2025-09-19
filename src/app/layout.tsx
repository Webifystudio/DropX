import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import BottomNav from "@/components/layout/bottom-nav";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "DropX India - Online Shopping",
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
        <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-gray-50 font-sans antialiased",
          inter.variable
        )}
      >
        <CartProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-20">{children}</main>
            <BottomNav />
          </div>
          <Toaster />
        </CartProvider>
        <Script src="https://unpkg.com/aos@2.3.1/dist/aos.js" strategy="afterInteractive" />
        <Script src="https://unpkg.com/feather-icons" strategy="afterInteractive" />
        <Script id="aos-init" strategy="afterInteractive">
          {`
            AOS.init({
              duration: 800,
              easing: 'ease-in-out',
              once: true
            });
            
            // Using a timeout to ensure feather is loaded.
            setTimeout(() => {
              if (typeof feather !== 'undefined') {
                feather.replace();
              }
            }, 50);
          `}
        </Script>
      </body>
    </html>
  );
}
