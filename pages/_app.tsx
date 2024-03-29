import {ChakraProvider} from '@chakra-ui/react';
import type {AppProps} from 'next/app';
import Router from 'next/router';
import nprogress from 'nprogress';
import {RecoilRoot} from 'recoil';
import {Frame} from '../components/Frame/Frame';
import Me from '../components/Session/Me';
import theme from '../utils/theme';

import 'nprogress/nprogress.css';

nprogress.configure({showSpinner: false, speed: 400, minimum: 0.25});

const MyApp = ({Component, pageProps, router}: AppProps) => {
  Router.events.on('routeChangeStart', () => {
    nprogress.start();
  });

  Router.events.on('routeChangeComplete', () => {
    nprogress.done();
  });

  Router.events.on('routeChangeError', () => {
    nprogress.done();
  });

  return (
    <>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Me />
          <Frame router={router}>
            <Component {...pageProps} />
          </Frame>
        </ChakraProvider>
      </RecoilRoot>
    </>
  );
};

export default MyApp;
