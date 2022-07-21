import {Tab, TabList, Tabs, Box} from '@chakra-ui/react';
import {Router} from 'next/router';
import React from 'react';

interface Props {
  router: Router;
}

const ProfileMenu = React.memo<Props>(props => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const path = props.router.pathname.split('/').at(-1);
    let i = 0;
    switch (path) {
      case 'mygood':
        i = 1;
        break;
      case 'matching':
        i = 2;
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

    let path = '/profile';
    switch (i) {
      case 0:
        break;
      case 1:
        path = '/profile/mygood';
        break;
      case 2:
        path = '/profile/matching';
        break;

      default:
        break;
    }

    setIndex(i);
    props.router.push(path);
  };

  return (
    <>
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
              <Tab mx=".5rem">募集</Tab>
              <Tab mx=".5rem">いいね</Tab>
              <Tab mx=".5rem">マッチ</Tab>
            </TabList>
          </Tabs>
        </Box>
      </Box>
    </>
  );
});

ProfileMenu.displayName = 'ProfileMenu';

export default ProfileMenu;
