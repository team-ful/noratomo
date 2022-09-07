import LoginForm from '../components/Login/Form';
import Require from '../components/Session/Require';

const Login = () => {
  return (
    <Require loginRequire={false} path="/home" title="ログイン | 野良友">
      <LoginForm />
    </Require>
  );
};

export default Login;
