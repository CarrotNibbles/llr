import { atom } from 'recoil';
import { useCheckedRecoilState } from '.';

type ZoomType = number;

const defaultZoom: ZoomType = 1;

const zoomState = atom<ZoomType>({
  key: 'zoomState',
  default: defaultZoom,
});

export const useZoomState = () => useCheckedRecoilState<ZoomType>(zoomState, defaultZoom);
