import Require from '../components/Session/Require';
import LoginForm from '../components/login/Form';

const Login = () => {
  return (
    <Require loginRequire={false} path="/">
      <LoginForm />
    </Require>
  );
};

export default Login;
