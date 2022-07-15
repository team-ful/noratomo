import {Box, Tab, Tabs, TabList, TabPanels, TabPanel} from '@chakra-ui/react';

import Matching from './Matching';
import MyGood from './MyGood';
import MyPost from './MyPost';
import UserProfile from './UserProfile';

// 全体を表示

const MyPage = () => {
  return (
    <div>
      <UserProfile />

      <Box>
        <Tabs colorScheme="orange">
          <TabList>
            <Tab>募集</Tab>
            <Tab>いいね</Tab>
            <Tab>マッチ</Tab>
          </TabList>
          <TabPanels maxWidth="424px">
            <TabPanel>
              <MyPost />
            </TabPanel>
            <TabPanel>
              <MyGood />
            </TabPanel>
            <TabPanel>
              <Matching />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </div>
  );
};

export default MyPage;
