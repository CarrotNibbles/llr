import type { DragControls } from 'framer-motion';
import { atom } from 'jotai';

export const activeEntriesAtom = atom(new Map<string, DragControls>());
