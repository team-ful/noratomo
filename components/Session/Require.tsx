import {Skeleton, Box} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import React from 'react';
import {useRecoilValue} from 'recoil';
import {UserState} from '../../utils/atom';
import Title from '../Common/Title';

interface Props {
  children: React.ReactNode;
  loginRequire: boolean;
  path: string;
  title?: string;
  adminOnly?: boolean;
  load?: React.ReactNode;
}

const Require: React.FC<Props> = ({
  children,
  loginRequire,
  path,
  adminOnly,
  load,
  title,
}) => {
  const [show, setShow] = React.useState(false);
  const user = useRecoilValue(UserState);
  const router = useRouter();

  React.useEffect(() => {
    if (typeof user !== 'undefined') {
      if ((user === null) === loginRequire) {
        router.replace(path);
      } else {
        if (adminOnly && !user?.is_admin) {
          // adminOnlyのページにアクセスしたのにユーザがadminではない場合
          router.replace(path);
        } else {
          setShow(true);
        }
      }
    }
  }, [user]);

  return (
    <>
      <Title>{title}</Title>
      {show ? (
        <Box minH="80vh">{children}</Box>
      ) : load ? (
        load
      ) : (
        <Skeleton>
          <Box w="100%" h="80vh"></Box>
        </Skeleton>
      )}
    </>
  );
};

export default Require;
