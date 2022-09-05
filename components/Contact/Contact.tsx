import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  FormErrorMessage,
  useToast,
  Select,
  Center,
  Box,
  Heading,
} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import React from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import {useRecoilState} from 'recoil';
import {UserState} from '../../utils/atom';

type ContactInputs = {
  category: string;
  text: string;
  mail: string;
};

const Contact = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<ContactInputs>();

  const [user, setUser] = useRecoilState(UserState);
  const toast = useToast();
  const router = useRouter();

  React.useEffect(() => {
    if (user) {
      setValue('mail', user.mail);
    }
  }, [user]);

  const onSubmit: SubmitHandler<ContactInputs> = async data => {
    const form = new FormData();

    if (data.category) {
      form.append('category', 'お問合せカテゴリ:' + data.category);
    }
    if (data.text) {
      form.append('text', 'お問合せ内容\n' + data.text);
    }
    if (data.mail) {
      form.append('mail', 'ご利用者メールアドレス:' + data.mail);
    }

    const res = await fetch('api/contact/contact', {
      method: 'POST',
      body: form,
    });

    if (res.ok) {
      toast({
        title: '送信完了 お問合せありがとうございます。',
        status: 'info',
      });
      router.push('/');
    } else {
      toast({
        title: await res.text(),
        status: 'error',
      });
    }
  };

  return (
    <Center>
      <Box mt="3rem" w={{base: '95%', sm: '400px', md: '500px'}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Heading>お問い合わせ</Heading>
          <FormControl isInvalid={Boolean(errors.category)} ml=".5rem">
            <FormLabel htmlFor="category">お問合せ内容のカテゴリ</FormLabel>
            <Select
              placeholder="カテゴリを選択"
              id="category"
              {...register('category', {
                required:
                  '上記にない場合、その他を選択し内容へ記述してください。',
              })}
            >
              <option value="1">サンプル1</option>
              <option value="2">サンプル2</option>
              <option value="3">サンプル3</option>
              <option value="4">その他</option>
            </Select>
            <FormErrorMessage>
              {errors.category && errors.category.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.text)} mt="1.2rem">
            <FormLabel htmlFor="text">お問合せ内容</FormLabel>
            <Textarea
              size="lg"
              placeholder="お問合せ内容をご入力ください。"
              id="text"
              {...register('text', {
                required: 'お問合せ内容をご入力ください',
                maxLength: {
                  value: 500,
                  message: '最大500文字まで表現して下さい',
                },
              })}
            />
            <FormErrorMessage>
              {errors.text && errors.text.message}
            </FormErrorMessage>
          </FormControl>
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
          <FormControl>
            {/*
            ユーザID（ログインしている場合）
            日時
            UA
            IPアドレス
            の四つは入力させる必要なし。自動で処理
            sendContactの方で処理しても良いかもしれないね
            */}
          </FormControl>
          <Button
            isLoading={isSubmitting}
            type="submit"
            marginTop="2rem"
            colorScheme="orange"
            width="100%"
          >
            送信
          </Button>
        </form>
      </Box>
    </Center>
  );
};
export default Contact;
