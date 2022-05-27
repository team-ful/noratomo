import {Button, Center, Link} from '@chakra-ui/react';

const Test = () => {
  return (
    <Center>
      <Link href="/api/oauth/cateirusso">
        <Button as="p">ログイン</Button>
      </Link>
    </Center>
  );
};

export default Test;
