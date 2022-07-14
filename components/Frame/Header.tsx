import {
  Box,
  Flex,
  Spacer,
  Heading,
  Center,
  Avatar,
  Link,
} from '@chakra-ui/react';
import '@fontsource/permanent-marker';
import {Tooltip} from '@chakra-ui/react';
import NextLink from 'next/link';
import Avater from '../Logo/Avater';
import IconChat from '../Logo/IconChat';
import IconHome from '../Logo/IconHome';
import IconPost from '../Logo/IconPost';
import MenuButton from '../Logo/MenuButton';
import NoticeExist from '../Logo/NoticeExist';
import useUser from '../Session/useUser';

const Header = () => {
  const user = useUser();
  return (
    <Box width="100%" height="3.5rem">
      <Flex height="100%">
        <Center height="100%">
          <Heading fontSize="2rem" fontFamily="Permanent Marker" ml=".5rem">
            NoraTomo
          </Heading>
        </Center>
        <Spacer />
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
                href="/"
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
                <Link>
                  <Avatar
                    size={{base: 'md', sm: 'sm'}}
                    src={user?.avatar_url}
                    icon={<Avater size="25px" />}
                  />
                </Link>
              </NextLink>
            </Center>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
