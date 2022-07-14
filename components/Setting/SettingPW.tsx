import {
  FormControl,
  FormLabel,
  Input,
  Center,
  Box,
  Button,
  useToast,
  FormErrorMessage,
  InputGroup,
  IconButton,
  InputRightElement,
} from '@chakra-ui/react';
import React from 'react';
import {SubmitHandler, useForm, FormProvider} from 'react-hook-form';
import {TbEye, TbEyeOff} from 'react-icons/tb';
import Password, {PasswordForm} from '../Common/Form/Password';

interface PasswordChangeForm extends PasswordForm {
  now_password: string;
}

const SettingPW = () => {
  const methods = useForm<PasswordChangeForm>();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: {errors, isSubmitting},
  } = methods;

  const toast = useToast();

  const [pwOk, setPWOk] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const onSubmit: SubmitHandler<PasswordChangeForm> = async data => {
    if (!pwOk) {
      setError('password', {
        type: 'custom',
        message: 'custom message',
      });
      return;
    } else {
      clearErrors('password');
    }

    toast({
      title: 'TODO: パスワード更新できるようにする',
      description: data.password,
      status: 'info',
    });
  };

  return (
    <Center>
      <Box mt="3rem" w={{base: '95%', sm: '400px', md: '500px'}}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={Boolean(errors.now_password)}>
              <FormLabel>現在のパスワード</FormLabel>
              <InputGroup>
                <Input
                  id="now_password"
                  type={show ? 'text' : 'password'}
                  placeholder="パスワード"
                  {...register('now_password', {
                    required: 'パスワードは必須です',
                  })}
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    aria-label="show password"
                    icon={
                      show ? <TbEye size="25px" /> : <TbEyeOff size="25px" />
                    }
                    size="sm"
                    onClick={() => setShow(!show)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.now_password && errors.now_password.message}
              </FormErrorMessage>
            </FormControl>
            <Password setOk={setPWOk}>新しいパスワード</Password>
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
        </FormProvider>
      </Box>
    </Center>
  );
};
export default SettingPW;
