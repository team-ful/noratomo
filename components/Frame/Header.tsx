import {Box, Flex, Spacer, Heading, Center, Avatar} from '@chakra-ui/react';
import '@fontsource/permanent-marker';
import {BsBoxSeam} from 'react-icons/bs';
import {IoChatbubbleOutline} from 'react-icons/io5';
import {RiAddBoxLine} from 'react-icons/ri';
import {TbHeartHandshake} from 'react-icons/tb';

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
          <Center ml=".5rem">
            <IoChatbubbleOutline size="26px" />
          </Center>
          <Center ml=".5rem">
            <TbHeartHandshake size="27px" />
          </Center>
          <Center ml=".5rem">
            <RiAddBoxLine size="27px" />
          </Center>
          <Center ml=".5rem">
            <BsBoxSeam size="27px" />
          </Center>
          <Center mr=".5rem" ml=".5rem">
            <Avatar size="sm" />
          </Center>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
