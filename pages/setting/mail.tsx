import type {NextPage} from 'next';
import Require from '../../components/Session/Require';
import SettingMailAddress from '../../components/Setting/SettingMailAddress';

const Mail: NextPage = () => {
  return (
    <Require loginRequire={true} path="/">
      <SettingMailAddress />
    </Require>
  );
};

export default Mail;
