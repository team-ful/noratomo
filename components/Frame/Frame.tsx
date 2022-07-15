import {Box, Flex, Center} from '@chakra-ui/react';
import {Router} from 'next/router';
import React from 'react';
import useUser from '../Session/useUser';
import SettingMenu from '../Setting/SettingMenu';
import Footer from './Footer';
import Header from './Header';
import HeaderToolbar from './HeaderToolbar';

export const Frame = React.memo<{children: React.ReactNode; router: Router}>(
  ({children, router}) => {
    const user = useUser();
    const pathname = router.pathname;

    // トップページ
    //
    // 横の余白は持たせない
    if (pathname === '/') {
      return (
        <Flex flexDirection="column" minHeight="100vh">
          <Box>
            <Box mx="2rem">
              <Header user={user} />
            </Box>
            {user && <HeaderToolbar />}
            {children}
          </Box>
          <Box marginTop="auto">
            <Footer />
          </Box>
        </Flex>
      );
    }

    if (pathname === '/login' || pathname === '/create/account') {
      return (
        <Center>
          <Flex
            flexDirection="column"
            minHeight="100vh"
            maxWidth="1000px"
            minWidth={{base: '96%', sm: 'auto'}}
          >
            <Box>
              <Header user={user} noLogin />
              <Center>
                <Box w="100%">{children}</Box>
              </Center>
            </Box>
            <Box marginTop="auto">
              <Footer />
            </Box>
          </Flex>
        </Center>
      );
    }

    // 設定ページ
    if (/\/setting\/?.*/g.test(pathname)) {
      return (
        <Center>
          <Flex
            flexDirection="column"
            minHeight="100vh"
            maxWidth="1000px"
            minWidth={{base: '96%', sm: 'auto'}}
          >
            <Box>
              <Header user={user} />
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
            <Header user={user} />
            {user && <HeaderToolbar />}
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
