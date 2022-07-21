import {
  Box,
  Avatar,
  Text,
  Button,
  Link,
  HStack,
  VStack,
  Spacer,
  Grid,
  GridItem,
  Heading,
  Center,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import Avater from '../Logo/Avater';
import useUser from '../Session/useUser';

// ユーザーのプロフィールのみを表示
const UserProfile = React.memo(() => {
  const user = useUser();

  return (
    <Box mt="2rem" w={{base: '96%x', sm: '100%'}}>
      <Grid
        ml="auto"
        w="96%"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(5, 1fr)"
      >
        <GridItem rowSpan={2} colSpan={1}>
          <VStack>
            <Avatar
              size={{base: 'xl', sm: '2xl'}}
              src={user?.avatar_url}
              icon={<Avater size="25px" />}
              boxShadow="10px 10px 30px #A0AEC0B3"
            />
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                {user?.display_name}
              </Text>
              <Text mt="0px" _before={{content: '"@"'}}>
                {user?.user_name}
              </Text>
            </Box>
          </VStack>
        </GridItem>
        <GridItem colSpan={4}>
          <HStack marginTop={{base: '20px', sm: '10px'}}>
            <Spacer />
            <Spacer />
            <Box>
              {/* コンポーネント化予定 */}
              <Text textAlign="center">10</Text>
              <Heading size="md">募集</Heading>
            </Box>
            <Spacer />
            <Box>
              {/* コンポーネント化予定 */}
              <Text textAlign="center">10</Text>
              <Heading size="md">いいね</Heading>
            </Box>
            <Spacer />
            <Box>
              {/* コンポーネント化予定 */}
              <Text textAlign="center">10</Text>
              <Heading size="md">マッチ</Heading>
            </Box>
            <Spacer />
          </HStack>
        </GridItem>
        <GridItem colSpan={2}></GridItem>
        <GridItem colSpan={2}>
          <Box textAlign="center" ml="0" mt={{base: '35px', sm: '50px'}}>
            <NextLink passHref href={'/setting'}>
              <Link>
                <Button
                  size={{base: 'xs', sm: 'sm'}}
                  fontSize={{base: 'xs', sm: 'sm'}}
                >
                  プロフィール編集
                </Button>
              </Link>
            </NextLink>
          </Box>
        </GridItem>
      </Grid>

      <Center m="2rem 1rem">
        <Text>{user?.profile}</Text>
      </Center>
    </Box>
  );
});

UserProfile.displayName = 'UserProfile';

export default UserProfile;
