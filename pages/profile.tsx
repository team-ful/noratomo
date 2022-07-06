import {Box} from '@chakra-ui/react';
import type {NextPage} from 'next';
import UserProfile from '../components/Profile/UserProfile';

import Require from '../components/Session/Require';

const Setting: NextPage = () => {
  return (
    <Box>
      <Require loginRequire={true} path="/">
        <UserProfile />
      </Require>
    </Box>
  );
};

export default Setting;
