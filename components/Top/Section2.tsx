import {Box, Center, Text, Heading} from '@chakra-ui/react';

const Section2 = () => {
  return (
    <Center h={{base: '60vh', lg: '100vh'}}>
      <Box
        background="center center / 100% auto no-repeat url(https://storage.googleapis.com/noratomo/contents/top_cat3.png)"
        h="100%"
      >
        <Center h="100%" backgroundColor="rgba(255, 255, 255, 0.86)">
          <Box w={{base: '97%', lg: '700px'}}>
            <Heading textAlign="center" color="orange.400" mb="2rem">
              特徴
            </Heading>
            <Box textAlign="center" fontSize={{base: '1.2rem', lg: '1.5rem'}}>
              <Text>一人で入りずらい場所やお店ありませんか？</Text>
              <Text>
                そんなときに一緒に行ってくれる人が欲しいなと思ったことはありませんか？
              </Text>
              <Text mt="1rem">
                <Text fontWeight="bold" color="orange.400" as="span">
                  のらとも
                </Text>
                を使えばいつでも募集をかけて都合のいい野良の友達と行き放題です！
              </Text>
            </Box>
          </Box>
        </Center>
      </Box>
    </Center>
  );
};

export default Section2;
