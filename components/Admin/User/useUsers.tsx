import {useToast} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import React from 'react';
import {AdminUser} from '../../../utils/types';

const LIMIT = 50;

interface Returns {
  users: AdminUser[];
  getLoad: boolean;
}

const useUsers = (): Returns => {
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [getLoad, setGetLoad] = React.useState(true); // 最初にgetするのでtrue

  const toast = useToast();
  const router = useRouter();

  React.useEffect(() => {
    if (users.length !== 0) return;
    if (!router.isReady) return;
    const query = router.query;

    let page = 0;
    if (typeof query['page'] === 'string') {
      page = parseInt(query['page']);
    }

    const f = async (page: number) => {
      const res = await fetch(
        `/api/admin/user?offset=${page * LIMIT}&limit=${LIMIT}`
      );
      setGetLoad(false);

      if (!res.ok) {
        toast({
          status: 'error',
          title: await res.text(),
        });
        return;
      }

      const body: AdminUser[] = await res.json();
      setUsers(body);
    };

    f(page);
  }, [router.isReady, router.query]);

  return {users, getLoad};
};

export default useUsers;
