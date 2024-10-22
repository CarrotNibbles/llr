import { atom, selector, useRecoilValue } from 'recoil';
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

const pixelPerFrameSelector = selector<number>({
  key: 'pixelPerFrameSelector',
  get: ({ get }) => {
    const PIXEL_PER_FRAME_DEFAULT = 0.2;
    const zoom = get(zoomState);
    return PIXEL_PER_FRAME_DEFAULT * zoom.value;
  },
});

export const useZoomState = () => useCheckedRecoilState<ZoomState>(zoomState, defaultState);
export const usePixelPerFrame = () => useRecoilValue(pixelPerFrameSelector);
