import type {NextPage} from 'next';
import Require from '../../components/Session/Require';

const Notice: NextPage = () => {
  return (
    <Require loginRequire={true} path="/">
      notice
    </Require>
  );
};

export default Notice;
