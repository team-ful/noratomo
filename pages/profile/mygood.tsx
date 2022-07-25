import type {NextPage} from 'next';
import Good from '../../components/Profile/Good';
import Require from '../../components/Session/Require';

const MyGood: NextPage = () => {
  return (
    <Require loginRequire={true} path="/">
      <Good />
    </Require>
  );
};

export default MyGood;
