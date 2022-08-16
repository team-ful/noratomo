import {Box, Center, SimpleGrid} from '@chakra-ui/react';
import React from 'react';
import {User} from '../../utils/types';
import IconChat from '../Logo/IconChat';
import IconHome from '../Logo/IconHome';
import IconPost from '../Logo/IconPost';
import IconSearch from '../Logo/IconSearch';
import MenuButton from '../Logo/MenuButton';
import NoticeExist from '../Logo/NoticeExist';
import NoticeNotExist from '../Logo/NoticeNotExist';

const HeaderToolbar: React.FC<{user: User}> = ({user}) => {
  return (
    <Box
      position="fixed"
      display={{base: 'block', sm: 'none'}}
      bottom="5px"
      w="100%"
      zIndex="10000"
    >
      <SimpleGrid
        columns={5}
        w="92%"
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
            icon={<IconPost size="26px" />}
            label="募集する"
            isTooltip={false}
            href="/entry/create/search"
          />
        </Center>

        <Center>
          <MenuButton
            icon={
              user.notice.length !== 0 ? (
                <NoticeExist size="25px" />
              ) : (
                <NoticeNotExist size="25px" />
              )
            }
            label="通知"
            isTooltip={false}
            href="/notice"
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
