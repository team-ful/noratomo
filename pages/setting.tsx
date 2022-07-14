import {Box} from '@chakra-ui/react';
import type {NextPage} from 'next';
import Require from '../components/Session/Require';

const Setting: NextPage = () => {
  return (
    <Box>
      <Require loginRequire={true} path="/">
        profile
      </Require>
    </Box>
  );
};

export default Setting;
