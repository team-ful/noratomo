import Require from '../components/Session/Require';
import Notice from '../components/User/Notice/Notice';

const NoticePage = () => {
  return (
    <Require loginRequire={true} path="/" title="通知 | 野良友">
      <Notice />
    </Require>
  );
};

export default NoticePage;
