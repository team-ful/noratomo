import {atom} from 'recoil';
import {User} from './types';

export const UserState = atom<User | null | undefined>({
  key: 'User',
  default: undefined,
});
