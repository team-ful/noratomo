import {Box, Center, VStack, Text} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import React from 'react';
import Pagination from './Pagination';
import SearchKeywordForm from './SearchKeyword';
import ShopContent from './ShopContent';
import useShopSearch from './useShopSearch';

const SearchShop = () => {
  const router = useRouter();
  const {
    shops,
    searchQuery,
    searchLatLon,
    load,
    resultsAvailable,
    resultsReturned,
  } = useShopSearch();

  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    if (!router.isReady) return;

    let _page = 1;
    if (typeof router.query['page'] === 'string') {
      _page = parseInt(router.query['page']);
      setPage(_page);
    }

    // keyword検索
    if (typeof router.query['keyword'] === 'string') {
      searchQuery(router.query['keyword'], _page);
    }

    if (
      typeof router.query['lat'] === 'string' &&
      typeof router.query['lon'] === 'string' &&
      typeof router.query['range'] === 'string'
    ) {
      searchLatLon(
        parseInt(router.query['lat']),
        parseInt(router.query['lon']),
        parseInt(router.query['range']),
        _page
      );
    }
  }, [router.isReady, router.query]);

  return (
    <Center w="100%">
      <VStack w="100%">
        <SearchKeywordForm />
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
        <Pagination all={resultsAvailable} current={page} />
      </VStack>
    </Center>
  );
};

export default SearchShop;
