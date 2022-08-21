import {
  Box,
  Center,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import useGetLoginHistories from '../Session/useGetLoginHistories';
import LoginHistoryItems from './LoginHistoryItems';

const LoginHistories = () => {
  const loginHistories = useGetLoginHistories();

  return (
    <Box w="100%" mt="3rem">
      <Heading mb="1rem" textAlign="center">
        ログイン履歴
      </Heading>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>test</TableCaption>
          <Thead>
            <Tr>
              <Th>
                <Center>ログイン日時</Center>
              </Th>
              <Th>
                <Center>ログイン端末</Center>
              </Th>
              <Th>
                <Center>ブラウザ/OS</Center>
              </Th>
              <Th>
                <Center>IPアドレス</Center>
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {loginHistories.map(data => {
              return <LoginHistoryItems data={data} key={data.id} />;
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>
                <Center>ログイン日時</Center>
              </Th>
              <Th>
                <Center>ログイン端末</Center>
              </Th>
              <Th>
                <Center>ブラウザ/OS</Center>
              </Th>
              <Th>
                <Center>IPアドレス</Center>
              </Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default LoginHistories;
