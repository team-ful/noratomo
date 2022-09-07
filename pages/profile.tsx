import {Box} from '@chakra-ui/react';
import type {NextPage} from 'next';
import MyPost from '../components/Profile/MyPost';
import Require from '../components/Session/Require';

const Profile: NextPage = () => {
  return (
    <Box>
      <Require loginRequire={true} path="/" title="プロフィール | 野良友">
        <MyPost />
      </Require>
    </Box>
  );
};

export default Profile;
