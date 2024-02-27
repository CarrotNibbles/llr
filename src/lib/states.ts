'use client';

import { useEffect, useState } from 'react';
import { type RecoilState, atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

type User =
  | {
      name: string;
      age: number;
    }
  | undefined;

type ZoomType = number;
type LastZoomType = number;

const defaultZoom: ZoomType = 1;
const defaultLastZoom: LastZoomType = 1;

const zoomState = atom<ZoomType>({
  key: 'zoomState',
  default: defaultZoom,
});

const lastZoomState = atom<LastZoomType>({
  key: 'lastZoomState',
  default: defaultLastZoom,
});

const defaultUser: User = undefined;

const userState = atom<User>({
  key: 'userState',
  default: defaultUser,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  effects_UNSTABLE: [persistAtom],
});

function useCheckedRecoilState<T>(recoilState: RecoilState<T>, defaultValue: T) {
  const [isInitial, setIsInitial] = useState(true);
  const [value, setValue] = useRecoilState(recoilState);

  useEffect(() => {
    if (isInitial) {
      setIsInitial(false);
    }
  }, [isInitial]);

  return [isInitial ? defaultValue : value, setValue] as const;
}

export const useUserState = () => useCheckedRecoilState<User>(userState, defaultUser);
export const useZoomState = () => useCheckedRecoilState<ZoomType>(zoomState, defaultZoom);
export const useLastZoomState = () =>
  useCheckedRecoilState<LastZoomType>(lastZoomState, defaultLastZoom);
