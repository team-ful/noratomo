import {
  Box,
  Flex,
  Spacer,
  Heading,
  Center,
  Avatar,
  Button,
} from '@chakra-ui/react';
import '@fontsource/permanent-marker';
import {Tooltip} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import {User} from '../../utils/types';
import Avater from '../Logo/Avater';
import IconChat from '../Logo/IconChat';
import IconHome from '../Logo/IconHome';
import IconPost from '../Logo/IconPost';
import MenuButton from '../Logo/MenuButton';
import NoticeExist from '../Logo/NoticeExist';

interface Props {
  noLogin?: boolean;
  user: User | undefined | null;
}

const Header: React.FC<Props> = ({user, noLogin}) => {
  return (
    <Box width="100%" height="3.5rem">
      <Flex height="100%">
        <Center height="100%">
          <NextLink passHref href="/">
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
        {noLogin ? <></> : user ? <LoginIcons user={user} /> : <NoLoginIcons />}
      </Flex>
    </Box>
  );
};

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
  return (
    <Flex>
      <Box display={{base: 'none', sm: 'flex'}}>
        <Center m=".5rem">
          <MenuButton
            icon={<IconHome size="25px" />}
            label="ホーム"
            isTooltip={true}
            href="/"
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
          <MenuButton
            icon={<NoticeExist size="25px" />}
            label="通知"
            isTooltip={true}
            href="/"
          />
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
      <Tooltip label="マイページ">
        <Center mr=".5rem" ml=".5rem">
          <NextLink passHref href={'/profile'}>
            <Box as="a">
              <Avatar
                size={{base: 'md', sm: 'sm'}}
                src={user?.avatar_url}
                icon={<Avater size="25px" />}
              />
            </Box>
          </NextLink>
        </Center>
      </Tooltip>
    </Flex>
  );
});

LoginIcons.displayName = 'LoginIcons';

export default Header;
