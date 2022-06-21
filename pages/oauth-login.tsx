import {Button, Center, Link} from '@chakra-ui/react';
import Require from '../components/Session/Require';

const LoginOauth = () => {
  return (
    <Require path="/" loginRequire={false}>
      <Center>
        <Link href="/api/oauth/cateirusso">
          <Button as="p">ログイン</Button>
        </Link>
      </Center>
    </Require>
  );
};

export default LoginOauth;
