import {
  Box,
  Avatar,
  Text,
  Button,
  Heading,
  Flex,
  Center,
  SimpleGrid,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import useSWR from 'swr';
import {fetcher} from '../../utils/swr';
import {NumberOf} from '../../utils/types';
import Avater from '../Logo/Avater';
import useUser from '../Session/useUser';

// ユーザーのプロフィールのみを表示
const UserProfile = React.memo(() => {
  const {data} = useSWR<NumberOf>('/api/user/number_of', fetcher);
  const user = useUser();

  return (
    <Center>
      <Box mt="3rem" w={{base: '96%', sm: '100%'}}>
        <Center w="100%">
          <Box ml=".5rem">
            <Avatar
              size={{base: 'xl', sm: '2xl'}}
              src={user?.avatar_url}
              icon={<Avater size="25px" />}
              boxShadow="10px 10px 30px #A0AEC0B3"
            />
            <Box mt="1rem" ml={{base: '0', sm: '.5rem'}}>
              <Text fontSize="1.6rem" fontWeight="bold" whiteSpace="nowrap">
                {user?.display_name}
              </Text>
              <Text mt="0px" _before={{content: '"@"'}}>
                {user?.user_name}
              </Text>
            </Box>
          </Box>
          <Box w="100%">
            <Flex mr="1rem" justifyContent="flex-end">
              <NextLink passHref href={'/setting'}>
                <Button as="a" size="md">
                  プロフィール編集
                </Button>
              </NextLink>
            </Flex>
            <Flex
              display={{base: 'none', sm: 'flex'}}
              mt="1rem"
              justifyContent="flex-end"
            >
              <SimpleGrid columns={3} spacing={5} w="300px">
                <Box>
                  <Text textAlign="center">{data?.entry ?? '-'}</Text>
                  <Heading fontSize="1rem" textAlign="center">
                    募集
                  </Heading>
                </Box>

                <Box>
                  <Text textAlign="center">{data?.application ?? '-'}</Text>
                  <Heading fontSize="1rem" textAlign="center">
                    いいね
                  </Heading>
                </Box>

                <Box>
                  <Text textAlign="center">{data?.meet ?? '-'}</Text>
                  <Heading fontSize="1rem" textAlign="center">
                    マッチ
                  </Heading>
                </Box>
              </SimpleGrid>
            </Flex>
          </Box>
        </Center>
        <Box display={{base: 'block', sm: 'none'}} mx=".5rem" mt=".5rem">
          <SimpleGrid columns={3} spacing={5}>
            <Box>
              <Text textAlign="center">10</Text>
              <Heading textAlign="center" size="md">
                募集
              </Heading>
            </Box>

            <Box>
              <Text textAlign="center">10</Text>
              <Heading textAlign="center" size="md">
                いいね
              </Heading>
            </Box>

            <Box>
              <Text textAlign="center">10</Text>
              <Heading textAlign="center" size="md">
                マッチ
              </Heading>
            </Box>
          </SimpleGrid>
        </Box>

        <Text m="2rem 1rem" as="pre">
          {user?.profile}
        </Text>
      </Box>
    </Center>
  );
});

UserProfile.displayName = 'UserProfile';

export default UserProfile;
