import CreateAccount from '../../components/Create/Account';
import Require from '../../components/Session/Require';

const Account = () => {
  return (
    <Require loginRequire={false} path="/">
      <CreateAccount />
    </Require>
  );
};

export default Account;
