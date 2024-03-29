import {Heading, Center, Box, Text} from '@chakra-ui/react';
import SearchKeywordForm from './SearchKeyword';
import SearchLatLon from './SearchLatLon';

const SearchInit = () => {
  return (
    <Center minH="80vh">
      <Box w="100%" mt="3rem">
        <Heading mb="1rem" textAlign="center">
          行きたいお店を検索しよう
        </Heading>
        <SearchKeywordForm />
        <Text my="1.5rem" textAlign="center">
          もしくは、
        </Text>
        <SearchLatLon
          style={{width: '100%', height: '400px'}}
          center={{
            lat: 35.680646653498705,
            lng: 139.76452856758127,
          }}
          zoom={13}
        />
      </Box>
    </Center>
  );
};

export default SearchInit;
