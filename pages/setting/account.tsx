import type {NextPage} from 'next';
import Require from '../../components/Session/Require';
import SettingAccount from '../../components/Setting/SettingAccount';

const Account: NextPage = () => {
  return (
    <Require loginRequire={true} path="/" title="アカウント設定 | 野良友">
      <SettingAccount />
    </Require>
  );
};

export default Account;
