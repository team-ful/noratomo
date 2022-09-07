import type {NextPage} from 'next';
import Require from '../../components/Session/Require';
import SettingPW from '../../components/Setting/SettingPW';

const Password: NextPage = () => {
  return (
    <Require loginRequire={true} path="/" title="パスワード設定 | 野良友">
      <SettingPW />
    </Require>
  );
};

export default Password;
