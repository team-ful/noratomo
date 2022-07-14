import {Box, Center, SimpleGrid} from '@chakra-ui/react';
import IconChat from '../Logo/IconChat';
import IconHome from '../Logo/IconHome';
import IconPost from '../Logo/IconPost';
import IconSearch from '../Logo/IconSearch';
import MenuButton from '../Logo/MenuButton';
import NoticeExist from '../Logo/NoticeExist';

const HeaderToolbar = () => {
  return (
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
        mx="1rem"
        p="5px"
        borderRadius="50px"
        bg="white"
        boxShadow="-5px 5px 14px #dedede"
        top="calc(100vh - 80px)"
        css={{
          // iPhoneだとdvhじゃないとツールバーが画面の外に出てしまうため重ねて定義する
          top: 'calc(100dvh - 80px)',
        }}
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
            icon={<IconPost size="26px" />}
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
  );
};

export default HeaderToolbar;
