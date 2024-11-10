'use client';

import { useEffect, useState } from 'react';
import { type RecoilState, useRecoilState } from 'recoil';

export function useCheckedRecoilState<T>(recoilState: RecoilState<T>, defaultValue: T) {
  const [isInitial, setIsInitial] = useState(true);
  const [value, setValue] = useRecoilState(recoilState);

  useEffect(() => {
    if (isInitial) {
      setIsInitial(false);
    }
  }, [isInitial]);

  return [isInitial ? defaultValue : value, setValue] as const;
}

export { useFilterState } from './filter';
export { useUserState } from './user';
export { useZoomState, usePixelPerFrame } from './zoom';
export { useAutoScrollState } from './autoscroll';
