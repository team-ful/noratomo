import {Meeting} from '../../components/Entry/Meeting';
import Require from '../../components/Session/Require';

const MeetingEntry = () => {
  return (
    <Require loginRequire={true} path="/">
      <Meeting />
    </Require>
  );
};

export default MeetingEntry;
