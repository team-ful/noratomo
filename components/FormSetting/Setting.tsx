import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  HStack,
  RadioGroup,
  Radio,
  Button,
  NumberInput,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
  Textarea,
  Switch,
} from '@chakra-ui/react';

const Config = () => {
  return (
    <form>
      <FormControl>
        <FormLabel>アバター画像を変更</FormLabel>
        {/* アバター用の画像アップするやつ */}
      </FormControl>
      <FormControl>
        <FormLabel>ユーザーネーム(表示名)</FormLabel>
        <Input id="" type="" />
        <FormHelperText>他の利用者に表示される名前です。</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>メールアドレス</FormLabel>
        <Input id="" type="" />
        <FormHelperText></FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>年齢</FormLabel>
        <NumberInput max={100} min={18}>
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <FormControl>
        <FormLabel>性別</FormLabel>
        <RadioGroup defaultValue="">
          <HStack spacing="24px">
            <Radio value="">男性</Radio>
            <Radio value="">女性</Radio>
            <Radio value="">その他</Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel>プロフィール</FormLabel>
        <Textarea placeholder="あなたのプロフィールを入力" />
      </FormControl>
      <FormControl>
        <Input id="password" type="password" placeholder="パスワード" />
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel>ページ内での通知を有効にする</FormLabel>
        <Switch id="email-alerts" />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel>メール通知を有効にする</FormLabel>
        <Switch id="email-alerts" />
      </FormControl>

      <Button>これで設定する</Button>
    </form>
  );
};

export default Config;
