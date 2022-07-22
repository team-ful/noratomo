import type {NextPage} from 'next';
import Require from '../../components/Session/Require';
import SettingAccount from '../../components/Setting/SettingAccount';

const Account: NextPage = () => {
  return (
    <Require loginRequire={true} path="/">
      <SettingAccount />
    </Require>
  );
};

export default Account;
