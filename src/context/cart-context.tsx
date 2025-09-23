
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: { name: string; code: string }, size?: string) => void;
  removeFromCart: (productId: string, color?: { name: string; code: string }, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: { name: string; code: string }, size?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isClient]);


  const addToCart = (product: Product, quantity = 1, color?: { name: string; code: string }, size?: string) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => 
        item.product.id === product.id &&
        item.color?.code === color?.code &&
        item.size === size
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id && item.color?.code === color?.code && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity, color, size }];
    });
    toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string, color?: { name: string; code: string }, size?: string) => {
    setCartItems((prevItems) => prevItems.filter(item => 
        !(item.product.id === productId && item.color?.code === color?.code && item.size === size)
    ));
  };

  const updateQuantity = (productId: string, quantity: number, color?: { name: string; code: string }, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId && item.color?.code === color?.code && item.size === size 
            ? { ...item, quantity } 
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.product.currentPrice * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount: isClient ? cartCount : 0, // Return 0 on server
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
