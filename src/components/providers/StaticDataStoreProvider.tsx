'use client';

import { type StaticDataStore, createStaticDataStore } from '@/lib/stores/staticDataStore';
import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

export type StaticDataStoreApi = ReturnType<typeof createStaticDataStore>;

export const StaticDataStoreContext = createContext<StaticDataStoreApi | undefined>(undefined);

export interface StaticStoreProviderProps {
  initState: Partial<StaticDataStore>;
  children: React.ReactNode;
}

export const StaticDataStoreProvider = ({ initState, children }: StaticStoreProviderProps) => {
  const storeRef = useRef<StaticDataStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createStaticDataStore(initState);
  }

  return <StaticDataStoreContext.Provider value={storeRef.current}>{children}</StaticDataStoreContext.Provider>;
};

export const useStaticDataStore = <T,>(selector: (store: StaticDataStore) => T): T => {
  const staticDataStoreContext = useContext(StaticDataStoreContext);

  if (!staticDataStoreContext) {
    throw new Error('useStaticDataStore must be used within StaticDataStoreProvider');
  }

  return useStore(staticDataStoreContext, selector);
};
