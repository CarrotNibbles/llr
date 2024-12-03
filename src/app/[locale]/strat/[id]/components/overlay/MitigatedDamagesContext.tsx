import { createContext } from 'use-context-selector';

export const MitigatedDamagesContext = createContext<Record<string, number>>({});
