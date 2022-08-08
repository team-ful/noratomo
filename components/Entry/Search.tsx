import {Box, Center, VStack, Text} from '@chakra-ui/react';
import React from 'react';
import Pagination from './Pagination';
import SearchKeywordForm from './SearchKeyword';
import ShopContent from './ShopContent';
import useShopSearch from './useShopSearch';

const SearchShop = () => {
  const {
    shops,
    searchQuery,
    searchLatLon,
    newPage,
    load,
    resultsAvailable,
    resultsReturned,
    page,
    init,
  } = useShopSearch();

  return (
    <Center w="100%">
      <VStack w="100%">
        <SearchKeywordForm searchQuery={searchQuery} />
        <Box w="100%">
          <Text textAlign="right">
            検索結果: {20 * page + resultsReturned}/{resultsAvailable}件
          </Text>
        </Box>
        <Box w="100%">
          {shops.map(v => {
            return <ShopContent key={v.id} shop={v} />;
          })}
        </Box>
        <Pagination all={resultsAvailable} init={init} newPage={newPage} />
      </VStack>
    </Center>
  );
};

export default SearchShop;
