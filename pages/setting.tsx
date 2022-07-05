import {Box} from '@chakra-ui/react';
import type {NextPage} from 'next';
import SettingForm from '../components/FormSetting/SettingForm';
import Require from '../components/Session/Require';

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
