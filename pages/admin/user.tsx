import User from '../../components/Admin/User/User';
import Require from '../../components/Session/Require';

const UserPage = () => {
  return (
    <Require path="/" loginRequire={true} adminOnly={true}>
      <User />
    </Require>
  );
};

export default UserPage;
