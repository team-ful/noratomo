import Create from '../../components/Create/Create';
import Require from '../../components/Session/Require';

const Account = () => {
  return (
    <Require loginRequire={false} path="/home" title="アカウント作成 | 野良友">
      <Create />
    </Require>
  );
};

export default Account;
