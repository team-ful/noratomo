import {useRouter} from 'next/router';
import React from 'react';
import {AdminUser} from '../../../utils/types';

interface Returns {
  user?: AdminUser;
  getLoad: boolean;
}

const useUser = (id: number): Returns => {
  const [user, setUser] = React.useState<AdminUser>();
  const [getLoad, setGetLoad] = React.useState(true); // 最初にgetするのでtrue

  const router = useRouter();

  React.useEffect(() => {
    const f = async () => {
      if (typeof id !== 'number') return;
      if (typeof user !== 'undefined') return;

      const res = await fetch(`/api/admin/user?user_id=${id}`);
      if (!res.ok) {
        await router.replace('/admin/user');
        return;
      }

      setGetLoad(false);

      const body: AdminUser = await res.json();
      setUser(body);
    };

    f();
  }, []);

  return {user, getLoad};
};

export default useUser;
