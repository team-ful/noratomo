import {atom} from 'recoil';
import {User, LoginHistoryUserElements} from './types';

export const UserState = atom<User | null | undefined>({
  key: 'User',
  default: undefined,
});

export const LoginHistoryUserElementsState =
  atom<LoginHistoryUserElements | null>({
    key: 'LoginHistroyUserElements',
    default: undefined,
  });
