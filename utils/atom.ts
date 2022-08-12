import {atom} from 'recoil';
import {User, LoginHistoryUserInfo} from './types';

export const UserState = atom<User | null | undefined>({
  key: 'User',
  default: undefined,
});

export const LoginHistoryUserInfoState = atom<LoginHistoryUserInfo | null>({
  key: 'LoginHistroyUserInfo',
  default: undefined,
});
