import {Detail} from '../../components/Entry/Detail';
import Require from '../../components/Session/Require';

const DetailEntry = () => {
  return (
    <Require loginRequire={true} path="/">
      <Detail />
    </Require>
  );
};

export default DetailEntry;
