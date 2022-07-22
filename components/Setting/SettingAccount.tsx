import {
  Button,
  FormControl,
  FormLabel,
  Switch,
  useToast,
  Flex,
  Center,
  Box,
  Spacer,
  Heading,
} from '@chakra-ui/react';
import {SubmitHandler, useForm} from 'react-hook-form';
import SettingAccountDanger from './SettingAccountDanger';

type NoticeSettingForm = {
  page_notification: boolean;
  email_notification: boolean;
};

const SettingNotice = () => {
  const {
    register,
    handleSubmit,
    formState: {isSubmitting, errors},
  } = useForm<NoticeSettingForm>();

  const toast = useToast();

  const onSubmit: SubmitHandler<NoticeSettingForm> = async data => {
    toast({
      title: 'TODO: 通知設定できるようにする',
      description: `page: ${data.page_notification}, mail: ${data.email_notification}`,
      status: 'info',
    });
  };

  return (
    <Center>
      <Box mt="3rem" w={{base: '95%', sm: '400px', md: '500px'}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Heading mb="2rem" fontSize="1.5rem">
            通知設定
          </Heading>
          <FormControl isInvalid={Boolean(errors.page_notification)} as={Flex}>
            <FormLabel htmlFor="page_notification">
              ページ内での通知を有効にする
            </FormLabel>
            <Spacer />
            <Switch id="page_notification" {...register('page_notification')} />
          </FormControl>
          <FormControl
            isInvalid={Boolean(errors.email_notification)}
            as={Flex}
            mt="1.5rem"
          >
            <FormLabel htmlFor="email_notification">
              メール通知を有効にする
            </FormLabel>
            <Spacer />
            <Switch
              id="email_notification"
              {...register('email_notification')}
            />
          </FormControl>
          <Button
            isLoading={isSubmitting}
            type="submit"
            marginTop="2rem"
            colorScheme="orange"
            width="100%"
          >
            保存
          </Button>
        </form>
        <SettingAccountDanger />
      </Box>
    </Center>
  );
};
export default SettingNotice;
