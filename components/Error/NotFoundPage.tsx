import {Center, Image} from '@chakra-ui/react';

const NotFoundPage = () => {
  return (
    <Center minH={{base: '50vh', md: '80vh'}}>
      <Image
        src="https://storage.googleapis.com/noratomo/contents/404.png"
        alt="not found image"
        width={{base: '80%', md: '500px'}}
      />
    </Center>
  );
};

export default NotFoundPage;
