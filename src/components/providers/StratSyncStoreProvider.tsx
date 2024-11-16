'use client';

import { type StratSyncStore, createStratSyncStore } from '@/lib/stores/stratSyncStore';
import { type ReactNode, createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

export type StratSyncStoreApi = ReturnType<typeof createStratSyncStore>;

export const StratSyncStoreContext = createContext<StratSyncStoreApi | undefined>(undefined);

export interface StratSyncStoreProviderProps {
  initState: Partial<StratSyncStore>;
  children: ReactNode;
}

export const StratSyncStoreProvider = ({ initState, children }: StratSyncStoreProviderProps) => {
  const storeRef = useRef<StratSyncStoreApi>(undefined);
  if (!storeRef.current) {
    storeRef.current = createStratSyncStore(initState);
  }

  return <StratSyncStoreContext.Provider value={storeRef.current}>{children}</StratSyncStoreContext.Provider>;
};

export const useStratSyncStore = <T,>(selector: (store: StratSyncStore) => T): T => {
  const stratSyncStoreContext = useContext(StratSyncStoreContext);

  if (!stratSyncStoreContext) {
    throw new Error('useStratSyncStore must be used within StratSyncStoreProvider');
  }

  return useStore(stratSyncStoreContext, selector);
};
