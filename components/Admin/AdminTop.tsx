import {
  Heading,
  Box,
  Center,
  Flex,
  Text,
  Button,
  Spacer,
} from '@chakra-ui/react';
import NextLink from 'next/link';

const AdminTop = () => {
  return (
    <Center>
      <Box mt="2rem" w={{base: '96%', md: '500px'}}>
        <Heading mb="2rem" textAlign="center">
          管理者ページ
        </Heading>
        <Flex alignItems="center">
          <Text>野良認証問題</Text>
          <Spacer />
          <NextLink passHref href="/admin/nora_question">
            <Button as="a">野良認証問題</Button>
          </NextLink>
        </Flex>
        <Flex alignItems="center" mt="1.5rem">
          <Text>全ユーザー参照（工事中）</Text>
          <Spacer />
          <NextLink passHref href="/admin/nora_question">
            <Button as="a">全ユーザー参照</Button>
          </NextLink>
        </Flex>
      </Box>
    </Center>
  );
};

export default AdminTop;
