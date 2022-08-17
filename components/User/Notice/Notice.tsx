import {
  Box,
  Center,
  Heading,
  Text,
  Button,
  Spacer,
  Link,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import {useRecoilState} from 'recoil';
import {UserState} from '../../../utils/atom';
import {Notice as NoticeType} from '../../../utils/types';

const Notice = () => {
  const toast = useToast();
  const [user, setUser] = useRecoilState(UserState);
  const [notice, setNotice] = React.useState<NoticeType[]>(user?.notice || []);

  React.useEffect(() => {
    const f = async () => {
      const res = await fetch('/api/user/notice');

      if (res.ok) {
        const body: NoticeType[] = await res.json();
        setNotice(body);
      } else {
        toast({
          status: 'error',
          title: '通知を取得できませんでした',
          description: await res.text(),
        });
      }
    };

    f();
  }, []);

  const onRead = (id: number) => {
    const f = async () => {
      if (typeof user === 'undefined' || user === null) {
        return;
      }

      const res = await fetch('/api/user/notice', {
        method: 'PUT',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}`,
      });

      if (res.ok) {
        let n = [...user.notice];
        n = n.filter(v => v.id !== id);
        setUser({
          ...user,
          notice: n,
        });

        let n2 = [...notice];
        n2 = n2.map(v => {
          if (v.id === id) {
            const vcp = {...v};
            vcp.is_read = true;
            return vcp;
          }
          return v;
        });
        setNotice(n2);
      } else {
        toast({
          status: 'error',
          title: await res.text(),
        });
      }
    };

    f();
  };

  return (
    <Center>
      <Box w="97%" mt="2rem">
        <Heading textAlign="center" mb="1rem">
          通知
        </Heading>
        {notice.map((v, i) => {
          return (
            <Box
              key={v.id}
              bgColor={i % 2 === 0 ? 'orange.100' : 'white'}
              minH="70px"
              alignItems="center"
              py="1rem"
              display={{base: 'block', md: 'flex'}}
            >
              <Box ml="1rem" mr="2rem">
                {typeof v.url !== 'undefined' ? (
                  <Link isExternal href={v.url}>
                    <Text fontSize="1.2rem" fontWeight="bold">
                      {v.title}
                    </Text>
                  </Link>
                ) : (
                  <Text fontSize="1.2rem" fontWeight="bold">
                    {v.title}
                  </Text>
                )}
                {typeof v.text !== 'undefined' && (
                  <Text color="gray.500">{v.text}</Text>
                )}
              </Box>
              {v.is_read || (
                <>
                  <Spacer />
                  <Box mx="1rem" textAlign={{base: 'right', md: 'center'}}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRead(v.id)}
                    >
                      既読
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          );
        })}
      </Box>
    </Center>
  );
};

export default Notice;
