import {Detail} from '../../components/Entry/Detail';
import Require from '../../components/Session/Require';

const DetailEntry = () => {
  return (
    <Require loginRequire={true} path="/" title="募集詳細 | 野良友">
      <Detail />
    </Require>
  );
};

export default DetailEntry;
