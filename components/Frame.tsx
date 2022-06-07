import {Box, Flex} from '@chakra-ui/react';
import React from 'react';
import Footer from './Footer';

export const Frame: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Box>
        {/* <Header /> */}
        {children}
      </Box>
      <Box marginTop="auto">
        <Footer />
      </Box>
    </Flex>
  );
};
