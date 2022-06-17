import {Box, Flex, Center} from '@chakra-ui/react';
import React from 'react';
import Footer from './Footer';
import Header from './Header';

export const Frame: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <Center>
      <Flex flexDirection="column" minHeight="100vh" maxWidth="1000px">
        <Box>
          <Header />
          {children}
        </Box>
        <Box marginTop="auto">
          <Footer />
        </Box>
      </Flex>
    </Center>
  );
};
