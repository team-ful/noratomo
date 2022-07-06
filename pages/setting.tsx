import {Box} from '@chakra-ui/react';
import type {NextPage} from 'next';
import Require from '../components/Session/Require';
import SettingForm from '../components/Setting/Setting';

const Setting: NextPage = () => {
  return (
    <Box>
      <Require loginRequire={true} path="/">
        <SettingForm />
      </Require>
    </Box>
  );
};

export default Setting;
