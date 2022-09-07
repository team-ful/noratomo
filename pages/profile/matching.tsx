import type {NextPage} from 'next';
import MatchingResult from '../../components/Profile/Matching';
import Require from '../../components/Session/Require';

const Matching: NextPage = () => {
  return (
    <Require loginRequire={true} path="/" title="プロフィール | 野良友">
      <MatchingResult />
    </Require>
  );
};

export default Matching;
