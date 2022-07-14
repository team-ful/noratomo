import {
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Heading,
  Center,
  Box,
} from '@chakra-ui/react';

import React from 'react';

import SettingMailAdress from './SettingMailAddress';
import SettingNotice from './SettingNotice';
import SettingPW from './SettingPW';
import SettingProfile from './SettingProfile';

const SettingForm = () => {
  return (
    <Center w="100%" h="100%">
      <Box>
        <Heading textAlign="center" mb="1rem">
          設定
        </Heading>
        <Tabs colorScheme="orange" maxW="448px">
          <TabList>
            <Tab>プロフィール</Tab>
            <Tab>パスワード</Tab>
            <Tab>メールアドレス</Tab>
            <Tab> 通知 </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SettingProfile />
            </TabPanel>

            <TabPanel>
              <SettingPW />
            </TabPanel>

            <TabPanel>
              <SettingMailAdress />
            </TabPanel>

            <TabPanel>
              <SettingNotice />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Center>
  );
};

export default SettingForm;
