import {
  HStack,
  VStack,
  RadioGroup,
  Radio,
  Textarea,
  Avatar,
  Text,
  Button,
  Box,
  Spacer,
} from '@chakra-ui/react';
import Avater from '../Logo/Avater';
import useUser from '../Session/useUser';

const Profile = () => {
  const user = useUser();
  return (
    <VStack width="100%" marginTop="20px">
      <Text fontSize="md">プロフィール・ユーザー情報を編集</Text>

      <HStack>
        <Box>
          <Avatar
            size={{base: 'lg', sm: 'md'}}
            src={user?.avatar_url}
            icon={<Avater size="25px" />}
          />
        </Box>
        <Spacer w="20px" />
        <VStack>
          <h2>ユーザー名(表示名)</h2>
          <p>{user?.user_name}</p>
        </VStack>
      </HStack>

      <HStack width="50%">
        <h2 text-align="right">メールアドレス</h2>
        <Spacer />
        <p>{user?.mail}</p>
      </HStack>

      <HStack width="50%">
        <h2 text-align="right">年齢</h2>
        <Spacer />
        <p>{user?.age}歳</p>
      </HStack>

      <HStack width="50%">
        <h2 text-align="right">性別</h2>
        <Spacer />
        <HStack spacing="24px">
          <RadioGroup value={user?.gender}>
            <HStack direction="column">
              <Radio value="1">男性</Radio>
              <Radio value="2">女性</Radio>
              <Radio value="3">その他</Radio>
            </HStack>
          </RadioGroup>
        </HStack>
      </HStack>
      <HStack width="50%">
        <h2 text-align="right">プロフィール</h2>
        <Spacer />
        <Textarea
          w="60%"
          placeholder="あなたのプロフィールを入力しましょう"
          value={user?.profile}
        />
      </HStack>

      <Button colorScheme="teal" variant="outline">
        プロフィール・ユーザー情報を変更する
      </Button>
    </VStack>
  );
};

export default Profile;
