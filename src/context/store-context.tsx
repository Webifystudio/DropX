
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { Store } from '@/lib/types';

interface StoreContextType {
  store: Store | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children, store }: { children: ReactNode; store: Store | null }) => {
  return (
    <StoreContext.Provider value={{ store }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
