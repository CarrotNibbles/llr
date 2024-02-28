'use client';

import { useEffect, useState } from 'react';
import { type RecoilState, atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { type Enums } from './database.types';
import { createClient } from './supabase/client';

const { persistAtom } = recoilPersist();

type User =
  | {
      name: string;
      age: number;
    }
  | undefined;

type ZoomType = number;

const defaultZoom: ZoomType = 1;

type FilterType = Map<Enums<'gimmick_type'>, boolean>;

const defaultFilter: FilterType = new Map([
  ['AutoAttack', false],
  ['Avoidable', true],
  ['Raidwide', true],
  ['Tankbuster', true],
  ['Hybrid', true],
  ['Enrage', true],
]);

const zoomState = atom<ZoomType>({
  key: 'zoomState',
  default: defaultZoom,
});

const filterState = atom<FilterType>({
  key: 'filterState',
  default: defaultFilter,
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
export const useFilterState = () => useCheckedRecoilState<FilterType>(filterState, defaultFilter);
