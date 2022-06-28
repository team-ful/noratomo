import {Box, Flex, Spacer, Heading, Center, Avatar} from '@chakra-ui/react';
import '@fontsource/permanent-marker';
import {Tooltip} from '@chakra-ui/react';
import {RiAddBoxLine, RiSearchLine} from 'react-icons/ri';
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
          <Box display={{base: 'none', sm: 'flex'}}>
            <Tooltip label="ホーム">
              <Center ml=".5rem">
                <IconHome size="25px" />
              </Center>
            </Tooltip>
            <Tooltip label="募集を作成">
              <Center ml=".5rem">
                <RiAddBoxLine size="25px" />
              </Center>
            </Tooltip>
            <Tooltip label="通知">
              <Center ml=".5rem">
                <NoticeExist size="25px" />
              </Center>
            </Tooltip>
            <Tooltip label="メッセージ">
              <Center ml=".5rem">
                <IconChat size="25px" />
              </Center>
            </Tooltip>
          </Box>
          <Tooltip label="マイページ">
            <Center mr=".5rem" ml=".5rem">
              <Avatar
                size={{base: 'sm', sm: 'sm'}}
                src={user?.avatar_url}
                icon={<Avater size="25px" />}
              />
            </Center>
          </Tooltip>
        </Flex>
      </Flex>
      <Box
        position="fixed"
        display={{base: 'block', sm: 'none'}}
        top="0"
        left="0"
        w="100%"
      >
        <Flex
          position="relative"
          left="0"
          zIndex="10"
          top="calc(100vh - 100px)"
          mx="2rem"
        >
          <Tooltip label="検索">
            <Center>
              <RiSearchLine size="30px" />
            </Center>
          </Tooltip>
          <Spacer />
          <Tooltip label="ホーム">
            <Center>
              <IconHome size="30px" />
            </Center>
          </Tooltip>
          <Spacer />
          <Tooltip label="募集を作成">
            <Center>
              <RiAddBoxLine size="30px" />
            </Center>
          </Tooltip>
          <Spacer />
          <Tooltip label="通知">
            <Center>
              <NoticeExist size="30px" />
            </Center>
          </Tooltip>
          <Spacer />
          <Tooltip label="メッセージ">
            <Center>
              <IconChat size="30px" />
            </Center>
          </Tooltip>
        </Flex>
      </Box>
    </Box>
  );
};

export default Header;
