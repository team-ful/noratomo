import {
  Box,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Tfoot,
  Th,
  Thead,
  Tr,
  Text,
} from '@chakra-ui/react';
import useSWR from 'swr';
import {fetcher} from '../../utils/swr';
import {LoginHistoryUserElements} from '../../utils/types';
import LoginHistoryItems from './LoginHistoryItems';

const LoginHistories = () => {
  const useGetLoginHistories = () => {
    const {data, error} = useSWR<LoginHistoryUserElements[], string>(
      '/api/user/login_history',
      fetcher<LoginHistoryUserElements[]>
    );

    return {
      data: data,
      error: error,
    };
  };

  const loginHistories = useGetLoginHistories();
  if (loginHistories.error) {
    return <Text>ログインエラー</Text>;
  }
  if (typeof loginHistories.data === 'undefined') {
    return <></>;
  } else {
    return (
      <Box w="100%" mt="3rem">
        <Heading mb="1rem" textAlign="center">
          ログイン履歴
        </Heading>
        <TableContainer
          overflowY={{base: 'auto', sm: 'visible'}}
          overflowX={{base: 'auto', sm: 'visible'}}
        >
          <Table variant="striped" colorScheme="orange">
            <Thead position="sticky" top="0" bgColor="white">
              <Tr>
                <Th textAlign="center">ログイン日時</Th>
                <Th textAlign="center">ログイン端末</Th>
                <Th textAlign="center">ブラウザ/OS</Th>
                <Th textAlign="center">IPアドレス</Th>
              </Tr>
            </Thead>

            <Tbody>
              {loginHistories.data.map(data => {
                return <LoginHistoryItems data={data} key={data.id} />;
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
};
export default LoginHistories;
