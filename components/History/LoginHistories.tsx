import {
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
import ALoginHistory from './ALoginHistory';

const LoginHistories = () => {
  const res = useGetLoginHistories();
  return (
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
          {res.reverse().map(data => {
            return <ALoginHistory data={data} key={data.id} />;
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
  );
};
export default LoginHistories;
