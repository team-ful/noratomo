import {
  Box,
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
              <Th>ログイン日時</Th>
              <Th>ログイン端末</Th>
              <Th>IPアドレス</Th>
            </Tr>
          </Thead>

          <Tbody>
            {loginHistories.map(data => {
              return <LoginHistoryItems data={data} key={data.id} />;
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>ログイン日時</Th>
              <Th>ログイン端末</Th>
              <Th>IPアドレス</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default LoginHistories;
