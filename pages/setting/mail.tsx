import type {NextPage} from 'next';
import Require from '../../components/Session/Require';
import SettingMailAddress from '../../components/Setting/SettingMailAddress';

const Mail: NextPage = () => {
  return (
    <Require loginRequire={true} path="/" title="メール設定 | 野良友">
      <SettingMailAddress />
    </Require>
  );
};

export default Mail;
