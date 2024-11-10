import { atom, selector, useRecoilValue } from 'recoil';
import { useCheckedRecoilState } from '.';

type AutoScrollState = {
  active: boolean;
  context: {
    startedFrame: number;
    startedTime: number;
  } | null;
};

const defaultState: AutoScrollState = {
  active: false,
  context: null,
};

const autoScrollState = atom<AutoScrollState>({
  key: 'autoScrollState',
  default: defaultState,
});

export const useAutoScrollState = () => useCheckedRecoilState<AutoScrollState>(autoScrollState, defaultState);
