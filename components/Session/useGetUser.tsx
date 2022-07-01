import {useSetRecoilState} from 'recoil';
import {UserState} from '../../utils/atom';

const useGetUser = (): [() => void] => {
  const setUser = useSetRecoilState(UserState);

  const get = () => {
    const f = async () => {
      const res = await fetch('/api/user/me');

      if (res.ok) {
        const u = await res.json();

        setUser({
          ...u,
          join_date: new Date(u.join_date),
        });
      } else if (res.status === 403) {
        setUser(null);
      } else {
        // なにかしたい気がする
        setUser(null);
      }
    };

    f();
  };

  return [get];
};

export default useGetUser;
