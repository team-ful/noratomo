import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Box,
  Center,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import useUser from '../Session/useUser';

type SettingInputs = {
  mail: string;
};

const SettingMailAddress = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<SettingInputs>();

  const toast = useToast();
  const user = useUser();

  React.useEffect(() => {
    if (user) {
      setValue('mail', user.mail);
    }
  }, [user]);

  const onSubmit: SubmitHandler<SettingInputs> = async data => {
    if (data.mail === user?.mail) {
      return;
    }

    toast({
      title: 'TODO: メールアドレスを更新できるようにする',
      description: data.mail,
      status: 'info',
    });
  };

  return (
    <Center>
      <Box mt="2rem" w={{base: '97%', sm: '400px', md: '500px'}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={Boolean(errors.mail)}>
            <FormLabel htmlFor="mail">メールアドレス</FormLabel>
            <Input
              id="mail"
              placeholder="メールアドレス"
              {...register('mail', {
                required: 'メールアドレスは必須です',
                pattern:
                  /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
              })}
            />
            <FormErrorMessage>
              {errors.mail && errors.mail.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            isLoading={isSubmitting}
            type="submit"
            marginTop="2rem"
            colorScheme="orange"
            width="100%"
          >
            更新
          </Button>
        </form>
      </Box>
    </Center>
  );
};
export default SettingMailAddress;
