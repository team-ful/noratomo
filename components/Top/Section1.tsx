import {Box, Button, Center} from '@chakra-ui/react';
import NextLink from 'next/link';

const Section1 = () => {
  return (
    <>
      <Center position="relative" w="100%" display={{base: 'none', lg: 'flex'}}>
        <Box
          position="absolute"
          top="0"
          paddingTop="30%"
          mt={{base: '10vh', lg: '0'}}
        >
          <NextLink passHref href="/create/account">
            <Button size="lg" as="a">
              さっそく始める
            </Button>
          </NextLink>
        </Box>
      </Center>
      <Box
        display={{base: 'none', lg: 'block'}}
        background="center center / 100% auto no-repeat url(https://storage.googleapis.com/noratomo/contents/top.png)"
        paddingTop="56.25%"
      />
      <Box
        display={{base: 'block', lg: 'none'}}
        background="bottom center / 100% auto no-repeat url(https://storage.googleapis.com/noratomo/contents/top_logo.png), center right / 40% auto no-repeat url(https://storage.googleapis.com/noratomo/contents/top_cat2.png), center left / 40% auto no-repeat url(https://storage.googleapis.com/noratomo/contents/top_cat1.png), center left / 200px no-repeat url(https://storage.googleapis.com/noratomo/contents/top_fish.png), bottom right / 200px no-repeat url(https://storage.googleapis.com/noratomo/contents/top_heart.png)"
        h="50vh"
      />
      <Center display={{base: 'flex', lg: 'none'}} mt="1rem">
        <NextLink passHref href="/create/account">
          <Button size={{base: 'md', lg: 'lg'}} as="a">
            さっそく始める
          </Button>
        </NextLink>
      </Center>
    </>
  );
};

export default Section1;
