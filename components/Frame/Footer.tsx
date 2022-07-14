// コトラにフッターの表示
import {Box, Container, Link, SimpleGrid, Stack, Text} from '@chakra-ui/react';
import NextLink from 'next/link';
import {ReactNode} from 'react';
import React from 'react';
import Logo from '../Logo/Logo';

//リストヘッダー
const ListHeader = ({children}: {children: ReactNode}) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

//ここからがヘッダーの中身
const Footer = React.memo(() => {
  return (
    <Box>
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{sm: '1fr 1fr 1fr', md: '2fr 1fr 1fr'}}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box width="100px">
              <Logo />
            </Box>
            <Text fontSize={'sm'}>© {new Date().getFullYear()} team-ful</Text>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>野良友</ListHeader>
            <NextLink href="/about" passHref>
              <Link>野良友について</Link>
            </NextLink>
            <NextLink href="/usage" passHref>
              <Link>使い方</Link>
            </NextLink>
            <NextLink href="/terms" passHref>
              <Link>利用規約</Link>
            </NextLink>
            <NextLink href="/po" passHref>
              <Link>プライバシーポリシー</Link>
            </NextLink>
            <NextLink href="/contacts" passHref>
              <Link>お問い合わせ</Link>
            </NextLink>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>チーム</ListHeader>
            <NextLink href="/about" passHref>
              <Link>私たちについて</Link>
            </NextLink>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
});

Footer.displayName = 'Footer';

export default Footer;
