import type {NextPage} from 'next';
import Require from '../../components/Session/Require';
import SettingMenu from '../../components/Setting/SettingMenu';

const Notice: NextPage = () => {
  return (
    <Require loginRequire={true} path="/">
      <SettingMenu index={3}>aaa</SettingMenu>
    </Require>
  );
};

export default Notice;
