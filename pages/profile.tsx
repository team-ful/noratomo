import {Box} from '@chakra-ui/react';
import type {NextPage} from 'next';
import MyPage from '../components/Profile/MyPage';
import Require from '../components/Session/Require';

const Profile: NextPage = () => {
  return (
    <Box>
      <Require loginRequire={true} path="/">
        <MyPage />
      </Require>
    </Box>
  );
};

export default Profile;
