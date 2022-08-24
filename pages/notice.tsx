import Require from '../components/Session/Require';
import Notice from '../components/User/Notice/Notice';

const NoticePage = () => {
  return (
    <Require loginRequire={true} path="/">
      <Notice />
    </Require>
  );
};

export default NoticePage;
