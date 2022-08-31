import {NextPage} from 'next';
import LoginHistories from '../../components/History/LoginHistories';
import Require from '../../components/Session/Require';

const LoginHistory: NextPage = () => {
  return (
    <Require loginRequire={true} path="/">
      <LoginHistories />
    </Require>
  );
};

export default LoginHistory;
