import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  //useToast,
} from '@chakra-ui/react';
import {useForm} from 'react-hook-form';
// import {useRecoilState} from 'recoil';
// import {UserState} from '../../utils/atom';

type SettingInputs = {
  mail: string;
};

const SettingMailAdress = () => {
  const {
    register,
    // handleSubmit,
    // setValue,
    formState: {errors, isSubmitting, isValid, isDirty},
  } = useForm<SettingInputs>();
  //   const [user, setUser] = useRecoilState(UserState);
  //   const toast = useToast();

  return (
    <div>
      <Heading textAlign="center" mb="1rem" size="lg">
        メールアドレス変更
      </Heading>
      <form>
        <FormControl isInvalid={Boolean(errors.mail)} isDisabled>
          <FormLabel htmlFor="mail">メールアドレス</FormLabel>
          <Input
            id="mail"
            placeholder="mail"
            {...register('mail', {
              required: '有効なアドレスを登録して下さい。',
              pattern:
                /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
            })}
          />
          <FormHelperText>
            ドットはアドレスの頭と尻尾に使用できず、連続で使用できません。
          </FormHelperText>
          <FormErrorMessage>
            {errors.mail && errors.mail.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          disabled={!isValid && !isDirty}
          isLoading={isSubmitting}
          type="submit"
          size="lg"
          mt="1rem"
        >
          保存
        </Button>
      </form>
    </div>
  );
};
export default SettingMailAdress;
