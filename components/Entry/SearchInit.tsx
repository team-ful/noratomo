import {Heading, Center, Box} from '@chakra-ui/react';
import SearchKeywordForm from './SearchKeyword';

const SearchInit = () => {
  return (
    <Center h="80vh" w="100%">
      <Box>
        <Heading mb="1rem">行きたいお店を検索しよう</Heading>
        <SearchKeywordForm />
        {/* <Text my="1.5rem" textAlign="center">
          もしくは、
        </Text> */}
      </Box>
    </Center>
  );
};

export default SearchInit;
