import {Tab, TabList, Tabs, Heading, Center, Box} from '@chakra-ui/react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';

interface Props {
  index: number;
  children: React.ReactNode;
}

const SettingMenu: React.FC<Props> = props => {
  const router = useRouter();

  const handleChange = (i: number) => {
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

    router.push(path);
  };

  return (
    <Center>
      <Box w="100%">
        <Heading textAlign="center" mb="1rem" mt="2rem">
          設定
        </Heading>
        <Box
          overflow="auto"
          css={{
            '&::-webkit-scrollbar': {display: 'none'},
            scrollbarWidth: 'none',
          }}
        >
          <Box width={{base: '700px', sm: '100%'}}>
            <Tabs isFitted defaultIndex={props.index} onChange={handleChange}>
              <TabList>
                <NextLink href="/setting" passHref>
                  <Tab mx=".5rem">プロフィール</Tab>
                </NextLink>
                <NextLink href="/setting/password" passHref>
                  <Tab mx=".5rem">パスワード</Tab>
                </NextLink>
                <NextLink href="/setting/mail" passHref>
                  <Tab mx=".5rem">メールアドレス</Tab>
                </NextLink>
                <NextLink href="/setting/notice" passHref>
                  <Tab mx=".5rem">通知</Tab>
                </NextLink>
              </TabList>
            </Tabs>
          </Box>
        </Box>
        {props.children}
      </Box>
    </Center>
  );
};

export default SettingMenu;
