import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Switch,
  // useToast,
} from '@chakra-ui/react';
import {useForm} from 'react-hook-form';
// import {useRecoilState} from 'recoil';
// import {UserState} from '../../utils/atom';

type SettingInputs = {
  email_notification: boolean;
  Internal_notification: boolean;
};

const SettingNotice = () => {
  const {
    // register,
    // handleSubmit,
    // setValue,
    formState: {isSubmitting, isValid, isDirty},
  } = useForm<SettingInputs>();

  // const [user, setUser] = useRecoilState(UserState);
  // const toast = useToast();

  return (
    <div>
      <Heading textAlign="center" mb="1rem" size="lg">
        通知
      </Heading>
      <form>
        <FormControl display="flex" alignItems="center" isDisabled>
          <FormLabel>ページ内での通知を有効にする</FormLabel>
          <Switch id="" />
        </FormControl>
        <FormControl display="flex" alignItems="center" isDisabled>
          <FormLabel>メール通知を有効にする</FormLabel>
          <Switch id="" />
        </FormControl>
        <Button
          disabled={true}
          isLoading={isSubmitting}
          type="submit"
          size="lg"
        >
          保存
        </Button>
      </form>
    </div>
  );
};
export default SettingNotice;
