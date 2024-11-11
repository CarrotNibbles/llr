import { atom } from 'recoil';
import { useCheckedRecoilState } from '.';

type NoteState = {
  moving: boolean;
  inserting: boolean;
  editColumnWidths: number[];
};

const defaultState: NoteState = {
  moving: false,
  inserting: false,
  editColumnWidths: [0, 0, 0, 0, 0, 0, 0, 0, 0],
};

const noteState = atom<NoteState>({
  key: 'noteState',
  default: defaultState,
});

export const useNoteState = () => useCheckedRecoilState<NoteState>(noteState, defaultState);
