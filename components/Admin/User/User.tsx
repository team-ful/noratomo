import {useRouter} from 'next/router';
import React from 'react';
import UserDetails from './UserDetails';
import UserList from './UserList';

const User = () => {
  const [ok, setOK] = React.useState(false);
  const [id, setId] = React.useState<number>();
  const router = useRouter();

  React.useEffect(() => {
    if (!router.isReady) return;
    const query = router.query;

    if (typeof query['id'] === 'string') {
      setId(parseInt(query['id']));
    } else {
      setId(undefined);
    }

    setOK(true);
  }, [router.isReady, router.query]);

  return <>{ok && <>{id ? <UserDetails id={id} /> : <UserList />}</>}</>;
};

export default User;
