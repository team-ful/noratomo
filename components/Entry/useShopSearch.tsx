import React from 'react';
import {Shop, Shops} from '../../utils/types';

interface Returns {
  shops: Shop[];
  searchQuery: (q: string, page: number) => void;
  searchLatLon: (lat: number, lon: number, range: number, page: number) => void;
  load: boolean;
  resultsAvailable: number;
  resultsReturned: number;
}

const useShopSearch = (): Returns => {
  const [shops, setShops] = React.useState<Shop[]>([]);
  const [load, setLoad] = React.useState(false);
  const [resultsAvailable, setResultsAvailable] = React.useState(0);
  const [resultsReturned, setResultsReturned] = React.useState(0);

  const searchQuery = (q: string, page: number) => {
    if (q === '') {
      reset();
      return;
    }

    const f = async () => {
      setLoad(true);

      const res = await fetch(`/api/shop/search?keyword=${q}&page=${page - 1}`);

      const data = (await res.json()) as Shops;
      insert(data);

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
        `/api/shop/search?lat=${String(lat)}&lon=${String(
          lon
        )}&range=${range}&page=${page - 1}`
      );

      const data = (await res.json()) as Shops;
      insert(data);

      setLoad(false);
    };

    f();
  };

  const insert = (data: Shops) => {
    setResultsAvailable(data.results.results_available);
    setResultsReturned(parseInt(data.results.results_returned));
    setShops(data.results.shop);
  };

  const reset = () => {
    setResultsAvailable(0);
    setResultsReturned(0);
    setShops([]);
  };

  return {
    shops,
    searchQuery,
    searchLatLon,
    load,
    resultsAvailable,
    resultsReturned,
  };
};

export default useShopSearch;
