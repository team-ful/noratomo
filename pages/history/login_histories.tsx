import {NextPage} from 'next';
import LoginHistories from '../../components/History/LoginHistories';
import Require from '../../components/Session/Require';

// pages/history/login_histories
const Login_histories: NextPage = () => {
  return (
    <Require loginRequire={true} path="/">
      <LoginHistories />
    </Require>
  );
};

export default Login_histories;
