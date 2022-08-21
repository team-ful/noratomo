import HomePage from '../components/Home/HomePage';
import Require from '../components/Session/Require';

const Home = () => {
  return (
    <Require path="/" loginRequire={true}>
      <HomePage />
    </Require>
  );
};

export default Home;
