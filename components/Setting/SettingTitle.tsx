import {Heading} from '@chakra-ui/react';
import React from 'react';

const SettingTitle = React.memo(() => {
  return (
    <Heading textAlign="center" mb="1rem" mt="2rem">
      設定
    </Heading>
  );
});

SettingTitle.displayName = 'SettingTitle';

export default SettingTitle;
