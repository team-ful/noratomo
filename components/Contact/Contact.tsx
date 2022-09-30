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
    form.append('category', data.category);
    form.append('text', data.text);
    form.append('mail', data.mail);

    let url: string;
    if (user) {
      url = 'api/contact/user_contact';
    } else {
      url = 'api/contact/non_user_contact';
    }
    const res = await fetch(url, {
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
        <Heading textAlign="center">お問い合わせ</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={Boolean(errors.category)} mt="1rem">
            <FormLabel htmlFor="category">お問合せ内容のカテゴリ</FormLabel>
            <Select
              placeholder="カテゴリを選択"
              id="category"
              {...register('category', {
                required:
                  '上記にない場合、その他を選択し内容へ記述してください。',
              })}
            >
              <option value="1">機能の追加・要望</option>
              <option value="2">マッチングについて</option>
              <option value="3">募集について</option>
              <option value="4">サービスについて</option>
              <option value="5">エラー・バグの報告</option>
              <option value="6">その他</option>
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
          <FormControl isInvalid={Boolean(errors.mail)} mt="1.2rem">
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
            送信
          </Button>
        </form>
      </Box>
    </Center>
  );
};
export default Contact;
