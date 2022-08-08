import SearchShop from '../../../components/Entry/Search';
import Require from '../../../components/Session/Require';

const Search = () => {
  return (
    <Require loginRequire={true} path="/">
      <SearchShop />
    </Require>
  );
};

export default Search;
