import type {NextPage} from 'next';
import Require from '../components/Session/Require';
import Top from '../components/Top/Top';

const Home: NextPage = () => {
  return (
    <Require loginRequire={false} path="/">
      <Top />
    </Require>
  );
};

export default Home;
