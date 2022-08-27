import {
  Box,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Text,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';
import useSWR from 'swr';
import {fetcher} from '../../utils/swr';
import {LoginHistoryUserElements} from '../../utils/types';
import LoginHistoryItems from './LoginHistoryItems';

const LoginHistories = () => {
  let isLoading = true;

  const {data, error} = useSWR<LoginHistoryUserElements[], string>(
    '/api/user/login_history',
    fetcher<LoginHistoryUserElements[]>
  );

  isLoading = false;

  if (error) {
    return <Text>ログインエラー</Text>;
  }
  if (typeof data === 'undefined') {
    return <></>;
  } else {
    return (
      <Box w="100%" mt="3rem">
        <Heading mb="1rem" textAlign="center">
          ログイン履歴
        </Heading>
        <Skeleton isLoaded={!isLoading}>
          <TableContainer
            overflowY={{base: 'auto', sm: 'visible'}}
            overflowX={{base: 'auto', sm: 'visible'}}
          >
            <Table variant="striped" colorScheme="orange">
              <Thead position="sticky" top="0" bgColor="white">
                <Tr>
                  <Th textAlign="center">ログイン日時</Th>
                  <Th textAlign="center">ログイン端末/OS</Th>
                  <Th textAlign="center">ブラウザ</Th>
                  <Th textAlign="center">IPアドレス</Th>
                </Tr>
              </Thead>

              <Tbody>
                {data.map(data => {
                  return <LoginHistoryItems data={data} key={data.id} />;
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Skeleton>
      </Box>
    );
  }
};
export default LoginHistories;
