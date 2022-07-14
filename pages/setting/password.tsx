import type {NextPage} from 'next';
import Require from '../../components/Session/Require';

const Password: NextPage = () => {
  return (
    <Require loginRequire={true} path="/">
      password
    </Require>
  );
};

export default Password;
