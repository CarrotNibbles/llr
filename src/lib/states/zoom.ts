import { atom } from 'recoil';
import { useCheckedRecoilState } from '.';

type ZoomState = {
  value: number;
  changeRatio: number;
};

const defaultState: ZoomState = {
  value: 1,
  changeRatio: 1,
};

const zoomState = atom<ZoomState>({
  key: 'zoomState',
  default: defaultState,
});

export const useZoomState = () => useCheckedRecoilState<ZoomState>(zoomState, defaultState);
