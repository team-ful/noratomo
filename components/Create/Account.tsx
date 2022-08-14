import {
  Center,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  useToast,
} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import React from 'react';
import {useForm, SubmitHandler, FormProvider} from 'react-hook-form';
import {CreateAccountPostForm, NoraQuestionAnswer} from '../../utils/types';
import Password, {PasswordForm} from '../Common/Form/Password';

interface CreateAccountForm extends PasswordForm {
  mail: string;
  user_name: string;
  age: string;
  gender: string;
}

interface Props {
  token: string;
  answers: NoraQuestionAnswer[];
}

const CreateAccount: React.FC<Props> = ({token, answers}) => {
  const [pwOk, setPWOK] = React.useState(false);
  const [load, setLoad] = React.useState(false);

  const toast = useToast();
  const router = useRouter();

  const methods = useForm<CreateAccountForm>();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: {errors},
  } = methods;

  const onSubmit: SubmitHandler<CreateAccountForm> = data => {
    if (!pwOk) {
      setError('password', {
        type: 'custom',
        message: 'custom message',
      });
      return;
    } else {
      clearErrors('password');
    }

    const f = async () => {
      setLoad(true);

      const body: CreateAccountPostForm = {
        user_name: data.user_name,
        mail: data.mail,
        password: data.password,
        age: parseInt(data.age),
        gender: parseInt(data.gender),

        token: token,
        answers: answers,
      };

      const res = await fetch('/api/create/password', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      setLoad(false);

      // TODO: ログインできないときになにかしたい
      if (res.ok) {
        window.location.href = '/hello';
      } else if (res.status === 403) {
        toast({
          status: 'error',
          title: '野良認証に失敗しました',
        });
        router.replace('/');
      } else {
        toast({
          status: 'error',
          title: await res.text(),
        });
      }
    };

    f();
  };

  return (
    <Center>
      <Box mt="2rem" w={{base: '96%', md: '500px'}}>
        <Heading textAlign="center" mb="1rem">
          新規作成
        </Heading>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={Boolean(errors.mail)}>
              <FormLabel htmlFor="mail">メールアドレス</FormLabel>
              <Input
                id="mail"
                type="email"
                placeholder="メールアドレス"
                {...register('mail', {
                  required: 'メールアドレスを入力してください',
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'メールアドレスの形式が違います',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.mail && errors.mail.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.user_name)} mt="1rem">
              <FormLabel htmlFor="user_name">ユーザ名</FormLabel>
              <Input
                id="user_name"
                type="text"
                placeholder="ユーザ名"
                {...register('user_name', {
                  required: 'ユーザ名を入力してください',
                  minLength: {value: 3, message: 'ユーザ名は3文字以上'},
                  maxLength: {value: 16, message: 'ユーザ名は16文字以下'},
                  pattern: {
                    value: /^[0-9a-zA-Z]+$/,
                    message: 'ユーザ名は半角英数字で入力してください',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.user_name && errors.user_name.message}
              </FormErrorMessage>
            </FormControl>
            <Password setOk={setPWOK}>パスワード</Password>
            <Flex display={{base: 'block', sm: 'flex'}}>
              <FormControl isInvalid={Boolean(errors.age)} mt="1rem" mr=".5rem">
                <FormLabel htmlFor="age">年齢</FormLabel>
                <NumberInput id="age" placeholder="年齢" min={0}>
                  <NumberInputField
                    {...register('age', {
                      required: '年齢を入力してください',
                      min: {
                        value: 0,
                        message: '年齢は0以上です',
                      },
                    })}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>
                  {errors.age && errors.age.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.gender)} mt="1rem">
                <FormLabel htmlFor="gender">性別</FormLabel>
                <Select
                  placeholder="性別を選択"
                  id="gender"
                  {...register('gender', {
                    required: '性別を入力してください',
                  })}
                >
                  <option value="1">男性</option>
                  <option value="2">女性</option>
                  <option value="3">その他</option>
                </Select>
                <FormErrorMessage>
                  {errors.gender && errors.gender.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Button mt={4} isLoading={load} type="submit" w="100%">
              新規作成
            </Button>
          </form>
        </FormProvider>
      </Box>
    </Center>
  );
};

export default CreateAccount;
