import Notice from '../../components/Admin/Notice';
import Require from '../../components/Session/Require';

const NoticePage = () => {
  return (
    <Require path="/" loginRequire={true} adminOnly={true}>
      <Notice />
    </Require>
  );
};

export default NoticePage;
