import HelloComponents from '../components/Hello';
import Require from '../components/Session/Require';

const Hello = () => {
  return (
    <Require path="/" loginRequire={true} title="ようこそ | 野良友">
      <HelloComponents />
    </Require>
  );
};

export default Hello;
