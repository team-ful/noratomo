import LoginHistories from '../../components/Session/LoginHistories';
import Require from '../../components/Session/Require';

// pages/history/login_histories
const Login_histories = () => {
  return (
    <Require loginRequire={true} path="/">
      <LoginHistories />
    </Require>
  );
};

export default Login_histories;
