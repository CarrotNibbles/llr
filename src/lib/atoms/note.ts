import { atom } from 'jotai';

export const noteAtom = atom({
  moving: false,
  inserting: false,
  editColumnWidths: [0, 0, 0, 0, 0, 0, 0, 0, 0],
} as {
  moving: boolean;
  inserting: boolean;
  editColumnWidths: number[];
});
