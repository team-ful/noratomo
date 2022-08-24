import {
  Center,
  Heading,
  Box,
  useToast,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  Button,
} from '@chakra-ui/react';
import {useForm, SubmitHandler} from 'react-hook-form';

interface Form {
  title: string;
  body?: string;
  url?: string;
}

const Notice = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: {errors, isSubmitting},
  } = useForm<Form>();
  const toast = useToast();

  const onSubmit: SubmitHandler<Form> = async data => {
    const form = new FormData();
    form.append('title', data.title);

    if (typeof data.body !== 'undefined') {
      form.append('body', data.body);
    }
    if (typeof data.url !== 'undefined') {
      form.append('url', data.url);
    }

    const res = await fetch('/api/admin/notice', {
      method: 'POST',
      body: form,
    });

    if (res.ok) {
      toast({
        status: 'info',
        title: '通知を送信しました',
        description: data.title,
      });
    } else {
      toast({
        status: 'error',
        title: '通知の送信に失敗しました',
        description: await res.text(),
      });
    }
  };

  return (
    <Center mt="2rem">
      <Box w="97%">
        <Heading textAlign="center" mb="1rem">
          全ユーザ通知送信
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={Boolean(errors.title)} mt="1rem">
            <FormLabel htmlFor="title">通知タイトル</FormLabel>
            <Input
              id="title"
              type="text"
              placeholder="通知タイトル"
              {...register('title', {
                required: 'この項目は必須です',
              })}
            />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.body)} mt="1rem">
            <FormLabel htmlFor="body">通知内容（オプション）</FormLabel>
            <Textarea id="body" {...register('body')} />
            <FormErrorMessage>
              {errors.body && errors.body.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.url)} mt="1rem">
            <FormLabel htmlFor="url">URL（オプション）</FormLabel>
            <Input
              id="url"
              type="url"
              placeholder="https://"
              {...register('url')}
            />
            <FormErrorMessage>
              {errors.url && errors.url.message}
            </FormErrorMessage>
          </FormControl>
          <Button mt="2rem" type="submit" w="100%" isLoading={isSubmitting}>
            送信する
          </Button>
        </form>
      </Box>
    </Center>
  );
};

export default Notice;
