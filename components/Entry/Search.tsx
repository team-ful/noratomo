import {Box, Center, VStack, Text, Link} from '@chakra-ui/react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';
import Pagination from './Pagination';
import SearchInit from './SearchInit';
import SearchKeywordForm from './SearchKeyword';
import ShopContent from './ShopContent';
import useShopSearch from './useShopSearch';

const SearchShop = () => {
  const router = useRouter();
  const {shops, searchQuery, searchLatLon, resultsAvailable, resultsReturned} =
    useShopSearch();

  const [page, setPage] = React.useState(1);
  const [init, setInit] = React.useState(true);
  const [isKeyword, setIsKeyword] = React.useState(true);

  React.useEffect(() => {
    if (!router.isReady) return;

    let _page = 1;
    if (typeof router.query['page'] === 'string') {
      _page = parseInt(router.query['page']);
      setPage(_page);
    }

    // 検索
    if (
      typeof router.query['keyword'] === 'string' &&
      router.query['keyword'] !== ''
    ) {
      searchQuery(router.query['keyword'], _page);
      setInit(true);
    } else if (
      typeof router.query['lat'] === 'string' &&
      typeof router.query['lon'] === 'string' &&
      typeof router.query['range'] === 'string'
    ) {
      searchLatLon(
        parseFloat(router.query['lat']),
        parseFloat(router.query['lon']),
        parseInt(router.query['range']),
        _page
      );
      setInit(true);
      setIsKeyword(false);
    } else {
      setInit(false);
    }
  }, [router.isReady, router.query]);

  return (
    <>
      {init ? (
        <Center w="100%">
          <VStack w="100%" mx=".5rem">
            {isKeyword && <SearchKeywordForm />}
            <Box w="100%">
              <Text textAlign="right">
                検索結果: {20 * (page - 1) + resultsReturned}/{resultsAvailable}
                件
              </Text>
            </Box>
            <Box w="100%">
              {shops.map(v => {
                return <ShopContent key={v.id} shop={v} />;
              })}
            </Box>
            <Pagination all={resultsAvailable} current={page} />
            <NextLink passHref href="/entry/create">
              <Link as="a">
                お店が見つからない場合は、自分でお店を追加することができます。
              </Link>
            </NextLink>
          </VStack>
        </Center>
      ) : (
        <SearchInit />
      )}
    </>
  );
};

export default SearchShop;
