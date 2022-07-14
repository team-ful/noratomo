import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Center,
  Box,
} from '@chakra-ui/react';
import {useForm} from 'react-hook-form';

type SettingInputs = {
  now_password: string;
  new_password: string;
};

const SettingPW = () => {
  const {
    // register,
    // handleSubmit,
    // setValue,
    formState: {isSubmitting, isValid, isDirty},
  } = useForm<SettingInputs>();
  // const [user, setUser] = useRecoilState(UserState);
  // const toast = useToast();

  return (
    <Center>
      <Box mt="2rem" w={{base: '97%', sm: '400px', md: '500px'}}>
        <Heading textAlign="center" mb="1rem" size="lg">
          パスワードパスワード変更
        </Heading>
        <form>
          <FormControl mb="1rem" isDisabled>
            <FormLabel>認証のため現在のパスワードを入力して下さい</FormLabel>
            <Input id="" type="" placeholder="現在のパスワードを入力" />
          </FormControl>

          <FormControl mb="1rem" isDisabled>
            <FormLabel>新しいパスワードを設定</FormLabel>
            <Input id="" type="" placeholder="新しいパスワードを入力" />
          </FormControl>
          <Button
            disabled={true}
            isLoading={isSubmitting}
            type="submit"
            size="lg"
            marginTop="2rem"
          >
            保存
          </Button>
        </form>
      </Box>
    </Center>
  );
};
export default SettingPW;
