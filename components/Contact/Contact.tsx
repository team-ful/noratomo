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
import React from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import {useRecoilState} from 'recoil';
import {UserState} from '../../utils/atom';
import {User} from '../../utils/types';

type ContactInputs = {
  category: string;
  text: string;
  mail: string;
  user_id: number;
  date: Date;
  UA: string;
  ip_address: string;
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

  React.useEffect(() => {
    if (user) {
      setValue('mail', user.mail);
      //ログインしているなら、UA,IP,UserIDを予め入れる。
    }
  }, [user]);

  const onSubmit: SubmitHandler<ContactInputs> = async data => {
    if (typeof user === 'undefined' || user === null) {
      return;
    }
    // const date = new Date();

    const body: {[key: string]: string | number} = {};
    const formattedBody: string[] = [];
    const u: User = {...user};

    if (data.category) {
      body.category = data.category;
    }
    if (data.mail) {
      body.mail = data.mail;
    }
    if (data.text) {
      body.text = data.text;
    }
    const msg = {content: body.text};

    for (const b in body) {
      formattedBody.push(`${b}=${encodeURIComponent(body[b])}`);
    }

    if (formattedBody.length === 0) {
      return;
    }

    const res = await fetch(process.env.DISCORD_CONTACT_URL || '', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(msg),
      // # TODO: フロント→バック→Discodeで串刺にすること。(HOTpepper参考)
      // https://www.youtube.com/watch?v=-4Lid7tBr6Y
      //
    });

    if (res.ok) {
      toast({
        title: '送信完了 お問合せありがとうございます。',
        status: 'info',
      });

      setUser(u);
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
                required: '上記にない場合、その他を選択',
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
                maxLength: {
                  value: 128,
                  message: '128文字まで表現して下さい',
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
            */}
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
      </Box>
    </Center>
  );
};
export default Contact;
