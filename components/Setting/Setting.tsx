import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputLeftAddon,
  InputGroup,
  HStack,
  VStack,
  RadioGroup,
  Radio,
  Button,
  NumberInput,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
  Textarea,
  Switch,
  NumberInputField,
  Avatar,
  Text,
} from '@chakra-ui/react';
import Avater from '../Logo/Avater';
import useUser from '../Session/useUser';

const SettingForm = () => {
  const user = useUser();
  return (
    <VStack spacing="">
      <Text fontSize="md">プロフィール・ユーザー情報を編集</Text>
      <form>
        <FormControl>
          <FormLabel>アバター画像を変更</FormLabel>
          <Avatar
            size={{base: 'md', sm: 'md'}}
            src={user?.avatar_url}
            icon={<Avater size="25px" />}
          />
          {/* アバター用の画像アップするやつ */}
        </FormControl>

        <FormControl>
          <FormLabel>ユーザーネーム(表示名)</FormLabel>
          <InputGroup>
            <InputLeftAddon>@</InputLeftAddon>
            <Input type="" value={user?.user_name} />
          </InputGroup>
          <FormHelperText>他の利用者に表示される名前です。</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>メールアドレス</FormLabel>
          <Input id="" type="" value={user?.mail} />
          <FormHelperText></FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>年齢</FormLabel>
          <NumberInput max={100} min={18}>
            <NumberInputField id="" value={user?.age} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>性別</FormLabel>
          <RadioGroup value={user?.gender}>
            <HStack spacing="24px">
              <Radio value="1">男性</Radio>
              <Radio value="2">女性</Radio>
              <Radio value="3">その他</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormLabel>プロフィール</FormLabel>
          <Textarea
            placeholder="あなたのプロフィールを入力しましょう"
            value={user?.profile}
          />
        </FormControl>

        <FormControl>
          <FormLabel>新しいパスワードを設定</FormLabel>
          <Input id="" type="" placeholder="新しいパスワードを入力" />
          <p>以前のパスワード：{}</p>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel>ページ内での通知を有効にする</FormLabel>
          <Switch id="" />
        </FormControl>
        <FormControl display="flex" alignItems="center">
          <FormLabel>メール通知を有効にする</FormLabel>
          <Switch id="" />
        </FormControl>

        <Button>これで設定する</Button>
      </form>
    </VStack>
  );
};

export default SettingForm;
