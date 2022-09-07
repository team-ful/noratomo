import {Box} from '@chakra-ui/react';
import type {NextPage} from 'next';
import Require from '../components/Session/Require';
import SettingProfile from '../components/Setting/SettingProfile';

const Setting: NextPage = () => {
  return (
    <Box>
      <Require loginRequire={true} path="/" title="設定 | 野良友">
        <SettingProfile />
      </Require>
    </Box>
  );
};

export default Setting;
