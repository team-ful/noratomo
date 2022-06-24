import NoraQuestion from '../../components/Admin/NoraQuestion';
import Require from '../../components/Session/Require';

const NoraQ = () => {
  return (
    <Require path="/" loginRequire={true} adminOnly={true}>
      <NoraQuestion />
    </Require>
  );
};

export default NoraQ;
