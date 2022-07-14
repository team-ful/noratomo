import {Box} from '@chakra-ui/react';
import type {NextPage} from 'next';
import Require from '../components/Session/Require';
import SettingMenu from '../components/Setting/SettingMenu';

const Setting: NextPage = () => {
  return (
    <Box>
      <Require loginRequire={true} path="/">
        <SettingMenu index={0}>aaa</SettingMenu>
      </Require>
    </Box>
  );
};

export default Setting;
