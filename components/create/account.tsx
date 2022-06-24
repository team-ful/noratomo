import {
  Center,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import {TbEye, TbEyeOff} from 'react-icons/tb';
import PasswordStrengthBar from 'react-password-strength-bar';

const PasswordChecklist = dynamic(() => import('react-password-checklist'), {
  ssr: false,
});

type CreateAccountForm = {
  mail: string;
  password: string;
  user_name: string;
  age: number;
  gender: number;
};

const CreateAccount = () => {
  const [show, setShow] = React.useState(false);
  const [pass, setPass] = React.useState('');
  const [pwOk, setPWOK] = React.useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: {errors, isSubmitting},
  } = useForm<CreateAccountForm>();

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

    alert('OK');
  };

  React.useEffect(() => {
    if (pass.length !== 0) {
      if (!pwOk) {
        setError('password', {
          type: 'custom',
          message: 'custom message',
        });
      } else {
        clearErrors('password');
      }
    }
  }, [pwOk, pass]);

  return (
    <Center>
      <Box mt="2rem" w={{base: '96%', md: '500px'}}>
        <Heading textAlign="center" mb="1rem">
          新規作成
        </Heading>
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
          <FormControl isInvalid={Boolean(errors.password)} mt="1rem">
            <FormLabel htmlFor="password">パスワード</FormLabel>
            <InputGroup>
              <Input
                id="password"
                type={show ? 'text' : 'password'}
                placeholder="パスワード"
                {...register('password', {
                  required: 'パスワードを入力してください',
                  onChange: e => {
                    setPass(e.target.value || '');
                  },
                })}
              />
              <InputRightElement>
                <IconButton
                  variant="ghost"
                  aria-label="show password"
                  icon={show ? <TbEye size="25px" /> : <TbEyeOff size="25px" />}
                  size="sm"
                  onClick={() => setShow(!show)}
                />
              </InputRightElement>
            </InputGroup>
            <PasswordStrengthBar
              password={pass}
              scoreWords={[
                '弱すぎかな',
                '弱いパスワードだと思う',
                '少し弱いパスワードかなと思う',
                'もう少し長くしてみない？',
                '最強!すごく良いよ!',
              ]}
              shortScoreWord="ナメんな"
              minLength={8}
            />
          </FormControl>
          <Box marginTop=".5rem">
            <PasswordChecklist
              rules={['minLength', 'specialChar', 'number', 'capital']}
              minLength={8}
              value={pass}
              messages={{
                minLength: 'パスワードは8文字以上',
                specialChar: 'パスワードに記号が含まれている',
                number: 'パスワードに数字が含まれている',
                capital: 'パスワードに大文字が含まれている',
              }}
              onChange={isValid => {
                let unmounted = false;
                if (isValid !== pwOk && !unmounted) {
                  setPWOK(isValid);
                }

                return () => {
                  unmounted = true;
                };
              }}
            />
          </Box>
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
          <Button
            mt={4}
            colorScheme="blue"
            isLoading={isSubmitting}
            type="submit"
            w="100%"
          >
            新規作成
          </Button>
        </form>
      </Box>
    </Center>
  );
};

export default CreateAccount;
