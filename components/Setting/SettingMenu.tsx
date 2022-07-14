import {Tab, TabList, Tabs, Box} from '@chakra-ui/react';
import {Router} from 'next/router';
import React from 'react';
import SettingTitle from './SettingTitle';

interface Props {
  router: Router;
}

const SettingMenu = React.memo<Props>(props => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const path = props.router.pathname.split('/').at(-1);
    let i = 0;
    switch (path) {
      case 'password':
        i = 1;
        break;
      case 'mail':
        i = 2;
        break;
      case 'notice':
        i = 3;
        break;
      default:
        break;
    }

    setIndex(i);
  }, []);

  const handleChange = (i: number) => {
    if (i === index) {
      return;
    }

    let path = '/setting';
    switch (i) {
      case 0:
        break;
      case 1:
        path = '/setting/password';
        break;
      case 2:
        path = '/setting/mail';
        break;
      case 3:
        path = '/setting/notice';
        break;
      default:
        break;
    }

    setIndex(i);
    props.router.push(path);
  };

  return (
    <>
      <SettingTitle />
      <Box
        overflow="auto"
        css={{
          '&::-webkit-scrollbar': {display: 'none'},
          scrollbarWidth: 'none',
        }}
      >
        <Box width={{base: '700px', sm: '100%'}}>
          <Tabs isFitted index={index} onChange={handleChange}>
            <TabList>
              <Tab mx=".5rem">プロフィール</Tab>
              <Tab mx=".5rem">パスワード</Tab>
              <Tab mx=".5rem">メールアドレス</Tab>
              <Tab mx=".5rem">通知</Tab>
            </TabList>
          </Tabs>
        </Box>
      </Box>
    </>
  );
});

SettingMenu.displayName = 'SettingMenu';

export default SettingMenu;
