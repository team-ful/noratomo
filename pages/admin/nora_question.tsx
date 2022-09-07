import NoraQuestion from '../../components/Admin/NoraQuestion/NoraQuestion';
import Require from '../../components/Session/Require';

const NoraQ = () => {
  return (
    <Require
      path="/"
      loginRequire={true}
      adminOnly={true}
      title="野良認証問題 | 野良友"
    >
      <NoraQuestion />
    </Require>
  );
};

export default NoraQ;
