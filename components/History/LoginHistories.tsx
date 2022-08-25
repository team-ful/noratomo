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
import useGetLoginHistories from '../Session/useGetLoginHistories';
import LoginHistoryItems from './LoginHistoryItems';

const LoginHistories = () => {
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
        <TableContainer>
          <Table variant="simple">
            <Thead>
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
            <Tfoot>
              <Tr>
                <Th textAlign="center">ログイン日時</Th>
                <Th textAlign="center">ログイン端末</Th>
                <Th textAlign="center">ブラウザ/OS</Th>
                <Th textAlign="center">IPアドレス</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Box>
    );
  }
};
export default LoginHistories;
