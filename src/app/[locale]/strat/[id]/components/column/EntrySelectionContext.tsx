import type { DragControls } from 'framer-motion';
import { createContext } from 'react';

type EntrySelectionContextType = {
  activeEntries: Map<string, DragControls>;
  setActiveEntries: React.Dispatch<React.SetStateAction<Map<string, DragControls>>>;
};

export const EntrySelectionContext = createContext<EntrySelectionContextType>({
  activeEntries: new Map(),
  setActiveEntries: () => {},
});
