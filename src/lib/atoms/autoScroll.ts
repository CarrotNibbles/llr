import { atom } from 'jotai';

export const autoScrollAtom = atom({
  active: false,
  context: null,
} as {
  active: boolean;
  context: {
    startedFrame: number;
    startedTime: number;
  } | null;
});
