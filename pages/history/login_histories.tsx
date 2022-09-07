import {NextPage} from 'next';
import LoginHistories from '../../components/History/LoginHistories';
import Require from '../../components/Session/Require';

const LoginHistory: NextPage = () => {
  return (
    <Require loginRequire={true} path="/" title="ログイン履歴 | 野良友">
      <LoginHistories />
    </Require>
  );
};

export default LoginHistory;
