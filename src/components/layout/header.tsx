
'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, Shield, Users } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="text-gray-600" />
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-blue-600">DropX</h1>
              <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                India
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
             <Link href="/creator" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <Users className="h-5 w-5" />
                Become a Creator
              </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/search">
                <Search className="h-6 w-6 text-gray-600" />
            </Link>
            <Link href="/cart" className="relative">
              <ShoppingCart className="text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                {user && user.email === 'akirastreamingzone@gmail.com' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                       <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                       </Link>
                    </DropdownMenuItem>
                  </>
                )}
                 <DropdownMenuSeparator />
                 {user ? (
                    <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
                 ): (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/login">Sign In</Link>
                    </DropdownMenuItem>
                 )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
