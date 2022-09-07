import type {NextPage} from 'next';
import Good from '../../components/Profile/Good';
import Require from '../../components/Session/Require';

const MyGood: NextPage = () => {
  return (
    <Require loginRequire={true} path="/" title="プロフィール | 野良友">
      <Good />
    </Require>
  );
};

export default MyGood;
