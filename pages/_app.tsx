import {ChakraProvider} from '@chakra-ui/react';
import type {AppProps} from 'next/app';
import Router from 'next/router';
import nprogress from 'nprogress';
import {RecoilRoot} from 'recoil';
import {Frame} from '../components/Frame/Frame';
import theme from '../utils/theme';

import 'nprogress/nprogress.css';

nprogress.configure({showSpinner: false, speed: 400, minimum: 0.25});

const MyApp = ({Component, pageProps}: AppProps) => {
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
      {/* <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
      </Head> */}
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Frame>
            <Component {...pageProps} />
          </Frame>
        </ChakraProvider>
      </RecoilRoot>
    </>
  );
};

export default MyApp;
