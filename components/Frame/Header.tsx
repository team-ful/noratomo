import {
  Box,
  Flex,
  Spacer,
  Heading,
  Center,
  Avatar,
  Button,
  MenuButton as MenuB,
  MenuList,
  MenuDivider,
  MenuItem,
  Menu,
  useDisclosure,
  Text,
  Divider,
  Link,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import '@fontsource/permanent-marker';
import NextLink from 'next/link';
import React from 'react';
import {RiFootprintLine} from 'react-icons/ri';
import {TbSettings, TbUserCircle, TbLogout} from 'react-icons/tb';
import {useSetRecoilState} from 'recoil';
import {UserState} from '../../utils/atom';
import {User} from '../../utils/types';
import Logout from '../Common/Logout';
import Avater from '../Logo/Avater';
import IconChat from '../Logo/IconChat';
import IconHome from '../Logo/IconHome';
import IconPost from '../Logo/IconPost';
import MenuButton, {MenuButtonMenu} from '../Logo/MenuButton';
import NoticeExist from '../Logo/NoticeExist';
import NoticeNotExist from '../Logo/NoticeNotExist';

interface Props {
  noLogin?: boolean;
  user: User | undefined | null;
}

const Header = React.memo<Props>(({user, noLogin}) => {
  return (
    <Box width="100%" height="3.5rem">
      <Flex height="100%">
        <Center height="100%">
          <NextLink passHref href={user ? '/home' : '/'}>
            <Heading
              fontSize="2rem"
              fontFamily="Permanent Marker"
              ml=".5rem"
              cursor="pointer"
            >
              NoraTomo
            </Heading>
          </NextLink>
        </Center>
        <Spacer />
        {noLogin || typeof user === 'undefined' ? (
          <></>
        ) : user ? (
          <LoginIcons user={user} />
        ) : (
          <NoLoginIcons />
        )}
      </Flex>
    </Box>
  );
});

Header.displayName = 'Header';

const NoLoginIcons = React.memo(() => {
  return (
    <Center>
      <NextLink passHref href="/login">
        <Button size="sm" as="a">
          ログイン
        </Button>
      </NextLink>
    </Center>
  );
});

NoLoginIcons.displayName = 'NoLoginIcons';

const LoginIcons = React.memo<{user: User}>(({user}) => {
  const setUser = useSetRecoilState(UserState);
  const toast = useToast();

  const readNotice = (id: number) => {
    const f = async () => {
      const res = await fetch('/api/user/notice', {
        method: 'PUT',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}`,
      });

      if (res.ok) {
        let notice = [...user.notice];

        notice = notice.filter(v => v.id !== id);

        setUser({
          ...user,
          notice: notice,
        });
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
    <Flex>
      <Box display={{base: 'none', sm: 'flex'}}>
        <Center m=".5rem">
          <MenuButton
            icon={<IconHome size="25px" />}
            label="ホーム"
            isTooltip={true}
            href={user ? '/home' : '/'}
          />
        </Center>

        <Center m=".5rem">
          <MenuButton
            icon={<IconPost size="25px" />}
            label="募集する"
            isTooltip={true}
            href="/entry/create/search"
          />
        </Center>

        <Center m=".5rem">
          <Menu>
            {({onClose}) => {
              return (
                <>
                  <MenuButtonMenu
                    icon={
                      user.notice.length !== 0 ? (
                        <NoticeExist size="25px" />
                      ) : (
                        <NoticeNotExist size="25px" />
                      )
                    }
                    label="通知"
                    isTooltip={true}
                  />
                  <MenuList p="0" w="300px">
                    <Box>
                      <Heading fontSize="1.2rem" textAlign="center" py=".8rem">
                        未読通知
                      </Heading>
                      <Divider />
                      {user.notice.map(v => {
                        return (
                          <Box
                            key={v.id}
                            w="100%"
                            borderBottom="1px"
                            borderColor="gray.200"
                          >
                            <Flex alignItems="center" mr=".5rem">
                              <Box mb="1rem">
                                <Text
                                  mt=".5rem"
                                  mx=".5rem"
                                  fontSize="1rem"
                                  maxW="230px"
                                  textOverflow="ellipsis"
                                  whiteSpace="nowrap"
                                  overflow="hidden"
                                >
                                  {v.title}
                                </Text>
                                {typeof v.text !== 'undefined' && (
                                  <Text
                                    fontSize=".8rem"
                                    color="gray.500"
                                    mx=".5rem"
                                    maxW="230px"
                                    textOverflow="ellipsis"
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                  >
                                    {v.text}
                                  </Text>
                                )}
                              </Box>
                              <Spacer />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => readNotice(v.id)}
                              >
                                既読
                              </Button>
                            </Flex>
                          </Box>
                        );
                      })}

                      <Text
                        w="100%"
                        textAlign="center"
                        my=".7rem"
                        onClick={onClose}
                      >
                        <NextLink passHref href="/notice">
                          <Link>すべて表示</Link>
                        </NextLink>
                      </Text>
                    </Box>
                  </MenuList>
                </>
              );
            }}
          </Menu>
        </Center>

        <Center m=".5rem">
          <MenuButton
            icon={<IconChat size="25px" />}
            label="チャット"
            isTooltip={true}
            href="/"
          />
        </Center>
      </Box>
      <MyPageIcon user={user} />
    </Flex>
  );
});

LoginIcons.displayName = 'LoginIcons';

const MyPageIcon = React.memo<{user: User}>(({user}) => {
  const logoutModal = useDisclosure();

  return (
    <Menu>
      <Center>
        <MenuB mx=".5rem">
          <NextLink passHref href={'/profile'}>
            <Box as="a">
              <Avatar
                size={{base: 'md', sm: 'sm'}}
                src={user?.avatar_url}
                icon={<Avater size="25px" />}
              />
            </Box>
          </NextLink>
        </MenuB>
      </Center>
      <MenuList>
        <NextLink passHref href="/profile">
          <MenuItem as="a" icon={<TbUserCircle size="20px" />}>
            プロフィール
          </MenuItem>
        </NextLink>
        <NextLink passHref href="/setting/account">
          <MenuItem as="a" icon={<TbSettings size="20px" />}>
            設定
          </MenuItem>
        </NextLink>

        <NextLink passHref href="/history/login_histories">
          <MenuItem as="a" icon={<RiFootprintLine size="20px" />}>
            ログイン履歴
          </MenuItem>
        </NextLink>

        <MenuDivider />
        <MenuItem onClick={logoutModal.onOpen} icon={<TbLogout size="20px" />}>
          ログアウト
        </MenuItem>
      </MenuList>
      <Logout onClose={logoutModal.onClose} isOpen={logoutModal.isOpen} />
    </Menu>
  );
});

MyPageIcon.displayName = 'MyPageIcon';

export default Header;
