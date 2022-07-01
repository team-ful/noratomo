import LoginForm from '../components/login/Form';
import Require from '../components/Session/Require'

const Login = () => {
  return (
      <Require loginRequire={false} path="/">
      <LoginForm />
    </Require>
  );
};

export default Login;
