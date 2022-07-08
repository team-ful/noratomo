import {Box} from '@chakra-ui/react';
import type {NextPage} from 'next';
import Profile from '../components/Profile/UserProfile';
import Require from '../components/Session/Require';

const UserProfile: NextPage = () => {
  return (
    <Box>
      <Require loginRequire={true} path="/">
        <Profile />
      </Require>
    </Box>
  );
};

export default UserProfile;
