import {Box, Flex, Spacer, Heading, Center, Avatar} from '@chakra-ui/react';
import '@fontsource/permanent-marker';
import {Tooltip} from '@chakra-ui/react';
import {RiAddBoxLine} from 'react-icons/ri';
import Avater from '../Logo/Avater';
import IconChat from '../Logo/IconChat';
import IconHome from '../Logo/IconHome';
import NoticeExist from '../Logo/NoticeExist';
import useUser from '../Session/useUser';

const Header = () => {
  const user = useUser();
  return (
    <Box width="100%" height="2.5rem">
      <Flex height="100%">
        <Center height="100%">
          <Heading fontSize="2rem" fontFamily="Permanent Marker" ml=".5rem">
            NoraTomo
          </Heading>
        </Center>
        <Spacer />
        <Flex>
          <Tooltip label="メッセージ">
            <Center ml=".5rem">
              <IconChat size="25px" />
            </Center>
          </Tooltip>
          <Tooltip label="通知">
            <Center ml=".5rem">
              <NoticeExist size="25px" />
            </Center>
          </Tooltip>
          <Tooltip label="募集を作成">
            <Center ml=".5rem">
              <RiAddBoxLine size="25px" />
            </Center>
          </Tooltip>
          <Tooltip label="ホーム">
            <Center ml=".5rem">
              <IconHome size="25px" />
            </Center>
          </Tooltip>
          <Tooltip label="マイページ">
            <Center mr=".5rem" ml=".5rem">
              <Avatar
                size="xs"
                src={user?.avatar_url}
                icon={<Avater size="1.5rem" />}
              />
            </Center>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
