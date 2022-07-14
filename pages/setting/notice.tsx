import type {NextPage} from 'next';
import Require from '../../components/Session/Require';
import SettingNotice from '../../components/Setting/SettingNotice';

const Notice: NextPage = () => {
  return (
    <Require loginRequire={true} path="/">
      <SettingNotice />
    </Require>
  );
};

export default Notice;
