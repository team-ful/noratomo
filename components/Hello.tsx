import {Box, Center, Heading, Skeleton} from '@chakra-ui/react';
import useUser from './Session/useUser';

const Hello = () => {
  const user = useUser();
  return (
    <Center h="80vh">
      <Skeleton isLoaded={typeof user !== 'undefined'}>
        <Heading>ようこそ {user?.user_name} さん</Heading>
      </Skeleton>
    </Center>
  );
};

export default Hello;
