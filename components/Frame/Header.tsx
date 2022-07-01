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
import MenuButton from '../Logo/MenuButton';
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
          boxShadow="-5px 5px 14px #dedede"
        >
          <Center>
            <MenuButton
              icon={<IconHome size="23px" />}
              label="ホーム"
              isTooltip={false}
              href="/"
            />
          </Center>

          <Center>
            <MenuButton
              icon={<IconSearch size="23px" />}
              label="検索"
              isTooltip={false}
              href="/"
            />
          </Center>

          <Center>
            <MenuButton
              icon={<IconPost size="23px" />}
              label="募集する"
              isTooltip={false}
              href="/"
            />
          </Center>

          <Center>
            <MenuButton
              icon={<NoticeExist size="23px" />}
              label="通知"
              isTooltip={false}
              href="/"
            />
          </Center>

          <Center>
            <MenuButton
              icon={<IconChat size="23px" />}
              label="チャット"
              isTooltip={false}
              href="/"
            />
          </Center>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Header;
