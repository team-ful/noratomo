import type {NextPage} from 'next';
import Require from '../../components/Session/Require';
import SettingMenu from '../../components/Setting/SettingMenu';

const Mail: NextPage = () => {
  return (
    <Require loginRequire={true} path="/">
      <SettingMenu index={2}>aaa</SettingMenu>
    </Require>
  );
};

export default Mail;
