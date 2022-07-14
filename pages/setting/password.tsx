import type {NextPage} from 'next';
import Require from '../../components/Session/Require';
import SettingForm from '../../components/Setting/Setting';

const Password: NextPage = () => {
  return (
    <Require loginRequire={true} path="/">
      <SettingForm />
    </Require>
  );
};

export default Password;
