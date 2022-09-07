import SearchShop from '../../../components/Entry/Search';
import Require from '../../../components/Session/Require';

const Search = () => {
  return (
    <Require loginRequire={true} path="/" title="お店検索 | 野良友">
      <SearchShop />
    </Require>
  );
};

export default Search;
