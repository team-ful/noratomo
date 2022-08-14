import Create from '../../components/Create/Create';
import Require from '../../components/Session/Require';

const Account = () => {
  return (
    <Require loginRequire={false} path="/">
      <Create />
    </Require>
  );
};

export default Account;
