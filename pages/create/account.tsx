import Require from '../../components/Session/Require';
import CreateAccount from '../../components/create/account';

const Account = () => {
  return (
    <Require loginRequire={false} path="/">
      <CreateAccount />
    </Require>
  );
};

export default Account;
