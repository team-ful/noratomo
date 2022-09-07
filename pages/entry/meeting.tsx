import {Meeting} from '../../components/Entry/Meeting';
import Require from '../../components/Session/Require';

const MeetingEntry = () => {
  return (
    <Require loginRequire={true} path="/" title="詳細 | 野良友">
      <Meeting />
    </Require>
  );
};

export default MeetingEntry;
