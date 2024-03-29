import {Button, Center, Link, Box, Heading} from '@chakra-ui/react';
import Require from '../components/Session/Require';

const LoginOauth = () => {
  return (
    <Require
      path="/home"
      loginRequire={false}
      title="管理者向けログイン | 野良友"
    >
      <Center h="80vh">
        <Box>
          <Heading color="orange.400">管理者向けログイン</Heading>
          <Center mt="1rem">
            <Link href="/api/oauth/cateirusso">
              <Button as="a">CateiruSSOでログイン</Button>
            </Link>
          </Center>
        </Box>
      </Center>
    </Require>
  );
};

export default LoginOauth;
