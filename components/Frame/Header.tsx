import {Box, Flex, Spacer, Heading, Center, Avatar} from '@chakra-ui/react';
import '@fontsource/permanent-marker';
import {BsBoxSeam} from 'react-icons/bs';
import {IoMdAddCircleOutline} from 'react-icons/io';
import {TbHeartHandshake} from 'react-icons/tb';

const Header = () => {
  return (
    <Box width="100%" height="2.5rem" bgColor="blue.100">
      <Flex height="100%">
        <Center height="100%">
          <Heading fontSize="2rem" fontFamily="Permanent Marker" ml=".5rem">
            NoraTomo
          </Heading>
        </Center>
        <Spacer />
        <Flex>
          <Center>
            <TbHeartHandshake size="30px" />
          </Center>
          <Center>
            <IoMdAddCircleOutline size="30px" />
          </Center>
          <Center>
            <BsBoxSeam size="30px" />
          </Center>
          <Center mr=".5rem">
            <Avatar size="sm" />
          </Center>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
