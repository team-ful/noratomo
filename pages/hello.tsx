import HelloComponents from '../components/Hello';
import Require from '../components/Session/Require';

const Hello = () => {
  return (
    <Require path="/" loginRequire={true}>
      <HelloComponents />
    </Require>
  );
};

export default Hello;
