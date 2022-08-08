import React from 'react';
import {Shop, Shops} from '../../utils/types';

interface Returns {
  shops: Shop[];
  searchQuery: (q: string, page: number) => void;
  searchLatLon: (lat: number, lon: number, range: number, page: number) => void;
  newPage: (page: number) => void;
  load: boolean;
  resultsAvailable: number;
  resultsReturned: number;
  page: number;
  init: boolean;
}

interface Query {
  keyword?: string;
  lat?: number;
  lon?: number;
  range?: number;
}

const useShopSearch = (): Returns => {
  const [shops, setShops] = React.useState<Shop[]>([]);
  const [load, setLoad] = React.useState(false);
  const [resultsAvailable, setResultsAvailable] = React.useState(0);
  const [resultsReturned, setResultsReturned] = React.useState(0);
  const [query, setQuery] = React.useState<Query>({});
  const [page, setPage] = React.useState(0);
  const [init, setInit] = React.useState(false);

  const searchQuery = (q: string, page: number) => {
    const f = async () => {
      setLoad(true);

      const res = await fetch(`/api/shop/search?keyword=${q}&page=${page}`);

      const data = (await res.json()) as Shops;
      insert(data);
      setQuery({keyword: q});
      setPage(0);
      setInit(!init);

      setLoad(false);
    };

    f();
  };

  const searchLatLon = (
    lat: number,
    lon: number,
    range: number,
    page: number
  ) => {
    const f = async () => {
      setLoad(true);

      const res = await fetch(
        `/api/shop/search?lat=${lat}&lon=${lon}&range=${range}&page=${page}`
      );

      const data = (await res.json()) as Shops;
      insert(data);
      setQuery({lat: lat, lon: lon, range: range});
      setPage(0);
      setInit(!init);

      setLoad(false);
    };

    f();
  };

  const newPage = (page: number) => {
    const f = async () => {
      setLoad(true);
      let res;
      if (typeof query.keyword === 'string') {
        res = await fetch(
          `/api/shop/search?keyword=${query.keyword}&page=${page}`
        );
      } else if (typeof query.lat === 'number') {
        res = await fetch(
          `/api/shop/search?lat=${query.lat}&lon=${query.lon}&range=${query.range}&page=${page}`
        );
      } else {
        return;
      }

      const data = (await res.json()) as Shops;
      insert(data);
      setPage(page);

      setLoad(false);
    };

    f();
  };

  const insert = (data: Shops) => {
    setResultsAvailable(data.results.results_available);
    setResultsReturned(parseInt(data.results.results_returned));
    setShops(data.results.shop);
  };

  return {
    shops,
    searchQuery,
    searchLatLon,
    newPage,
    load,
    resultsAvailable,
    resultsReturned,
    page,
    init,
  };
};

export default useShopSearch;
