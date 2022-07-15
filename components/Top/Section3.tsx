import {
  Center,
  Box,
  Heading,
  UnorderedList,
  ListItem,
  Text,
} from '@chakra-ui/react';

const Section3 = () => {
  return (
    <Center h={{base: '40vh', lg: '70vh'}}>
      <Box
        background="center center / 60% auto no-repeat url(https://storage.googleapis.com/noratomo/contents/top_cat1.png)"
        h="100%"
      >
        <Center h="100%" backgroundColor="rgba(255, 255, 255, 0.9)">
          <Box w={{base: '97%', lg: '700px'}}>
            <Heading textAlign="center" color="orange.400" mb="2rem">
              こんなあなたに！
            </Heading>
            <Box fontSize={{base: '1.2rem', lg: '1.5rem'}}>
              <UnorderedList>
                <ListItem>
                  気になるお店があるけど、
                  <Text
                    background="linear-gradient(transparent 70%, #F6AD55 0%)"
                    as="span"
                  >
                    １人で行く勇気がない…
                  </Text>
                </ListItem>
                <ListItem>
                  食べ放題に行きたいけど、
                  <Text
                    background="linear-gradient(transparent 70%, #F6AD55 0%)"
                    as="span"
                  >
                    1人じゃ入れさせてくれない…
                  </Text>
                </ListItem>
                <ListItem>
                  1回行けば慣れるけど、
                  <Text
                    background="linear-gradient(transparent 70%, #F6AD55 0%)"
                    as="span"
                  >
                    最初がなぁ
                  </Text>
                </ListItem>
              </UnorderedList>
            </Box>
          </Box>
        </Center>
      </Box>
    </Center>
  );
};

export default Section3;
