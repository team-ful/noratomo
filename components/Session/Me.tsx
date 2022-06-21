import React from 'react';
import {useSetRecoilState} from 'recoil';
import {UserState} from '../../utils/atom';
import cookieValue from '../../utils/cookie';
import useGetUser from './useGetUser';

const Me = () => {
  const [get] = useGetUser();
  const setUser = useSetRecoilState(UserState);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkCookie = cookieValue('noratomo-options');

      if (checkCookie) {
        get();
      } else {
        setUser(null);
      }
    }
  }, []);

  return <></>;
};

export default Me;
