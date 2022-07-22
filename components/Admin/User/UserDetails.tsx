import {
  Box,
  Heading,
  Skeleton,
  Table,
  Tbody,
  Tr,
  Td,
  Center,
  Avatar,
  Text,
  Badge,
} from '@chakra-ui/react';
import React from 'react';
import {parseDate, parseGender} from '../../../utils/parse';
import useUser from './userUser';

interface Props {
  id: number;
}

const UserDetails: React.FC<Props> = ({id}) => {
  const {user, getLoad} = useUser(id);
  return (
    <Box mt="2rem">
      <Skeleton isLoaded={!getLoad}>
        <Heading textAlign="center">ユーザ id: {user?.id}</Heading>
        <Box>
          <Center mt="3rem">
            <Avatar src={user?.avatar_url} size="xl" />
          </Center>
          <Table variant="striped" mt="2rem">
            <Tbody>
              <Tr>
                <Td fontWeight="bold">ID</Td>
                <Td>{user?.id}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">ユーザー名</Td>
                <Td>{user?.user_name}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">表示名</Td>
                <Td>
                  {user?.display_name || <Badge variant="solid">NULL</Badge>}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">メールアドレス</Td>
                <Td>{user?.mail}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">年齢</Td>
                <Td>{user?.age || <Badge variant="solid">NULL</Badge>}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">性別</Td>
                <Td>
                  {user?.gender ? (
                    parseGender(user.gender)
                  ) : (
                    <Badge variant="solid">NULL</Badge>
                  )}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">管理者</Td>
                <Td>{user?.is_admin ? 'はい' : 'いいえ'}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">ban</Td>
                <Td>{user?.is_ban ? 'はい' : 'いいえ'}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">ペナルティ</Td>
                <Td>{user?.is_penalty ? 'はい' : 'いいえ'}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">作成日時</Td>
                <Td>{parseDate(new Date(user?.join_date || ''))}</Td>
              </Tr>
            </Tbody>
          </Table>
          <Box mt="2rem">
            <Heading fontSize="1.5rem" mt="1rem">
              プロフィール
            </Heading>
            <Text mt="1rem">
              {user?.profile || <Badge variant="solid">NULL</Badge>}
            </Text>
          </Box>
        </Box>
      </Skeleton>
    </Box>
  );
};

export default UserDetails;
