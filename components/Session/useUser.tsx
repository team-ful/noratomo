import {useRecoilValue} from 'recoil';
import {UserState} from '../../utils/atom';

const useUser = () => {
  return useRecoilValue(UserState);
};

export default useUser;
