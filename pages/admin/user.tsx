import User from '../../components/Admin/User/User';
import Require from '../../components/Session/Require';

const UserPage = () => {
  return (
    <Require
      path="/"
      loginRequire={true}
      adminOnly={true}
      title="全ユーザー | 野良友"
    >
      <User />
    </Require>
  );
};

export default UserPage;
