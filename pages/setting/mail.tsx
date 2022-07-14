import type {NextPage} from 'next';
import Require from '../../components/Session/Require';

const Mail: NextPage = () => {
  return (
    <Require loginRequire={true} path="/">
      mail
    </Require>
  );
};

export default Mail;
