import {Box, Heading, Center, Button, Text} from '@chakra-ui/react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';

const Section4 = () => {
  const [secretCount, setSecretCount] = React.useState(1);
  const router = useRouter();

  const handlerCount = () => {
    if (secretCount >= 10) {
      router.push('/oauth-login');
      return;
    }

    setSecretCount(secretCount + 1);
  };

  return (
    <Center h={{base: '40vh', lg: '70vh'}}>
      <Box w={{base: '97%', lg: '700px'}}>
        <Heading
          textAlign="center"
          color="orange.400"
          mb="3rem"
          onClick={handlerCount}
        >
          さあ、今すぐ始めよう！
        </Heading>
        <Center fontSize={{base: '1.2rem', lg: '1.5rem'}}>
          <NextLink passHref href="/create/account">
            <Button as="a">新規作成</Button>
          </NextLink>

          <Text mx="1rem">もしくは</Text>
          <NextLink passHref href="/login">
            <Button as="a" variant="outline">
              ログイン
            </Button>
          </NextLink>
        </Center>
      </Box>
    </Center>
  );
};

export default Section4;
