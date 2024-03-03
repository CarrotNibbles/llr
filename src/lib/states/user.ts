import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { useCheckedRecoilState } from '.';

const { persistAtom } = recoilPersist();

type User =
  | {
      name: string;
      age: number;
    }
  | undefined;

const defaultUser: User = undefined;

const userState = atom<User>({
  key: 'userState',
  default: defaultUser,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  effects_UNSTABLE: [persistAtom],
});

export const useUserState = () => useCheckedRecoilState<User>(userState, defaultUser);
