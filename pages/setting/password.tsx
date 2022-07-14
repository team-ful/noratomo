import type {NextPage} from 'next';
import Require from '../../components/Session/Require';
import SettingMenu from '../../components/Setting/SettingMenu';

const Password: NextPage = () => {
  return (
    <Require loginRequire={true} path="/">
      <SettingMenu index={1}>aaa</SettingMenu>
    </Require>
  );
};

export default Password;
