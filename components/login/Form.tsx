import {
  Box,
  Center,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Heading,
  Link,
  Divider,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';

type LoginInputs = {
  user: string;
  password: string;
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginInputs>();
  const router = useRouter();
  const [load, setLoad] = React.useState(false);

  const onSubmit: SubmitHandler<LoginInputs> = data => {
    const send = async () => {
      setLoad(true);
      const res = await fetch('/api/login/password', {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: `user=${data.user}&password=${data.password}`,
      });

      setLoad(false);

      // TODO: ログインできないときになにかしたい
      if (res.ok) {
        router.push('/hello');
      }
    };

    send();
  };

  return (
    <Center>
      <Box mt="2rem" w={{base: '96%', md: '500px'}}>
        <Heading textAlign="center" mb="1rem">
          ログイン
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={Boolean(errors.user)} mt="3rem">
            <FormLabel htmlFor="user">メールアドレスまたはユーザ名</FormLabel>
            <Input
              id="user"
              type="text"
              placeholder="メールアドレスまたはユーザ名"
              {...register('user', {
                required: 'この項目は必須です',
              })}
            />
            <FormErrorMessage>
              {errors.user && errors.user.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={Boolean(errors.password)}
            mt="1rem"
            mb=".5rem"
          >
            <FormLabel htmlFor="password">パスワード</FormLabel>
            <Input
              id="password"
              type="password"
              placeholder="パスワード"
              {...register('password', {
                required: 'この項目は必須です',
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <NextLink href="/login/forget" passHref>
            <Link>パスワードを忘れましたか？</Link>
          </NextLink>
          <Button
            colorScheme="blue"
            width="100%"
            mt="1.5rem"
            type="submit"
            isLoading={load}
          >
            ログイン
          </Button>
        </form>
        <Center>
          <Divider my="1.5rem" width="95%" />
        </Center>
        <Center>
          <NextLink href="/login/forget" passHref>
            <Link textAlign="center">アカウントを作成する</Link>
          </NextLink>
        </Center>
      </Box>
    </Center>
  );
};

export default LoginForm;
