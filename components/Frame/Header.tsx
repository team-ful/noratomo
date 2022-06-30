import {
  Box,
  Flex,
  Spacer,
  Heading,
  Center,
  Avatar,
  SimpleGrid,
} from '@chakra-ui/react';
import '@fontsource/permanent-marker';
import {Tooltip} from '@chakra-ui/react';
import Avater from '../Logo/Avater';
import IconChat from '../Logo/IconChat';
import IconHome from '../Logo/IconHome';
import IconPost from '../Logo/IconPost';
import IconSearch from '../Logo/IconSearch';
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
            <Center m=".5rem">
              <IconHome size="25px" label="ホーム" />
            </Center>

            <Center m=".5rem">
              <IconPost size="25px" label="募集する" />
            </Center>

            <Center m=".5rem">
              <NoticeExist size="25px" label="通知" />
            </Center>

            <Center m=".5rem">
              <IconChat size="25px" label="チャット" />
            </Center>
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
        <SimpleGrid
          columns={5}
          position="relative"
          left="0"
          zIndex="10"
          top="calc(100vh - 80px)"
          mx="1rem"
          p="5px"
          borderRadius="50px"
          bg="white"
          boxShadow="-5px 5px 14px #d4d4d4"
        >
          <Center>
            <IconSearch size="35px" iName="検索" />
          </Center>

          <Center>
            <IconHome size="35px" iName="ホーム" />
          </Center>

          <Center>
            <IconPost size="35px" iName="募集する" />
          </Center>

          <Center>
            <NoticeExist size="35px" iName="通知" />
          </Center>

          <Center>
            <IconChat size="35px" iName="チャット" />
          </Center>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Header;
