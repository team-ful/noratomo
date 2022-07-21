import {Box, Flex, Center} from '@chakra-ui/react';
import {Router} from 'next/router';
import React from 'react';
import ProfileMenu from '../Profile/ProfileMenu';
import UserProfile from '../Profile/UserProfile';
import SettingMenu from '../Setting/SettingMenu';
import Footer from './Footer';
import Header from './Header';
import HeaderToolbar from './HeaderToolbar';

export const Frame = React.memo<{children: React.ReactNode; router: Router}>(
  ({children, router}) => {
    if (/\/setting\/?.*/g.test(router.pathname)) {
      return (
        <Center>
          <Flex
            flexDirection="column"
            minHeight="100vh"
            maxWidth="1000px"
            minWidth={{base: '96%', sm: 'auto'}}
          >
            <Box>
              <Header />
              <Center>
                <Box w="100%">
                  <SettingMenu router={router} />
                  {children}
                </Box>
              </Center>
            </Box>
            <Box marginTop="auto">
              <Footer />
            </Box>
          </Flex>
        </Center>
      );
    } else if (/\/profile\/?.*/g.test(router.pathname)) {
      return (
        <Center>
          <Flex
            flexDirection="column"
            minHeight="100vh"
            maxWidth="1000px"
            minWidth={{base: '96%', sm: 'auto'}}
          >
            <Box>
              <Header />
              <HeaderToolbar />
              <Center>
                <Box w="100%">
                  <UserProfile />
                  <ProfileMenu router={router} />
                  {children}
                </Box>
              </Center>
            </Box>
            <Box marginTop="auto">
              <Footer />
            </Box>
          </Flex>
        </Center>
      );
    }

    return (
      <Center>
        <Flex
          flexDirection="column"
          minHeight="100vh"
          maxWidth="1000px"
          minWidth={{base: '96%', sm: 'auto'}}
        >
          <Box>
            <Header />
            <HeaderToolbar />
            {children}
          </Box>
          <Box marginTop="auto">
            <Footer />
          </Box>
        </Flex>
      </Center>
    );
  }
);

Frame.displayName = 'Frame';
