import {Box, Flex, Spacer, Heading, Center} from '@chakra-ui/react';
import '@fontsource/permanent-marker';

const Header = () => {
  return (
    <Box width="100%" height="2.5rem" bgColor="blue.100">
      <Flex height="100%">
        <Center height="100%">
          <Heading fontSize="2rem" fontFamily="Permanent Marker" m=".5rem">
            NoraTomo
          </Heading>
        </Center>
        <Spacer />
        <Box bg="green.400">Box 2</Box>
      </Flex>
    </Box>
  );
};

export default Header;
