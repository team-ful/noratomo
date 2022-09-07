import Notice from '../../components/Admin/Notice';
import Require from '../../components/Session/Require';

const NoticePage = () => {
  return (
    <Require
      path="/"
      loginRequire={true}
      adminOnly={true}
      title="全ユーザー通知 | 野良友"
    >
      <Notice />
    </Require>
  );
};

export default NoticePage;
