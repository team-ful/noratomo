import {Box, Flex, Spacer, Heading, Center, Avatar} from '@chakra-ui/react';
import '@fontsource/permanent-marker';
import {Tooltip} from '@chakra-ui/react';
import {BsBoxSeam} from 'react-icons/bs';
import {IoChatbubbleOutline} from 'react-icons/io5';
import {RiAddBoxLine} from 'react-icons/ri';
import {TbHeartHandshake, TbTools} from 'react-icons/tb';
import IconHome from '../Logo/IconHome';

const Header = () => {
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
              <IoChatbubbleOutline size="26px" />
            </Center>
          </Tooltip>
          <Tooltip label="通知">
            <Center ml=".5rem">
              <TbHeartHandshake size="27px" />
            </Center>
          </Tooltip>
          <Tooltip label="募集を作成">
            <Center ml=".5rem">
              <RiAddBoxLine size="27px" />
            </Center>
          </Tooltip>
          <Tooltip label="ホーム">
            <Center ml=".5rem">
              <IconHome size="27px" />
            </Center>
          </Tooltip>
          <Tooltip label="マイページ">
            <Center mr=".5rem" ml=".5rem">
              <Avatar size="sm" />
            </Center>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
