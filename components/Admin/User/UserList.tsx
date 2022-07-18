import {
  Box,
  Heading,
  Skeleton,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Avatar,
  Button,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import useUsers from './useUsers';

const UserList = () => {
  const {users, getLoad} = useUsers();

  return (
    <Box mt="2rem">
      <Heading textAlign="center">ユーザ（全{users.length}件）</Heading>
      <Box overflow="scroll" mt="2rem">
        <Box>
          <Skeleton isLoaded={!getLoad} overflowX="scroll">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>ID</Th>
                  <Th>ユーザー名</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((v, i) => {
                  return (
                    <Tr key={`tr_key_${i}`}>
                      <Td>
                        <Avatar src={v.avatar_url} size="sm" />
                      </Td>
                      <Td>{v.id}</Td>
                      <Td>{v.user_name}</Td>
                      <Td>
                        <NextLink passHref href={`/admin/user?id=${v.id}`}>
                          <Button size="sm" as="a">
                            詳細
                          </Button>
                        </NextLink>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Skeleton>
        </Box>
      </Box>
    </Box>
  );
};

export default UserList;
