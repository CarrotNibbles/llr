import { atom } from 'jotai';

export const zoomAtom = atom({
  value: 1,
  changeRatio: 1,
} as {
  value: number;
  changeRatio: number;
});

export const pixelPerFrameAtom = atom((get) => {
  const PIXEL_PER_FRAME_DEFAULT = 0.2;
  const zoom = get(zoomAtom);
  return PIXEL_PER_FRAME_DEFAULT * zoom.value;
});
