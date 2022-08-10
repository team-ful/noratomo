import {
  Box,
  Flex,
  Avatar,
  Center,
  Heading,
  Text,
  Badge,
  Skeleton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import React from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import {Shop} from '../../utils/types';

interface EntryForm {
  title: string;
  body?: string;
}

interface Props {
  hotppepper: string;
}

const EntryFormByShop: React.FC<Props> = ({hotppepper}) => {
  const [shop, setShop] = React.useState<Shop>();
  const [request, setRequest] = React.useState(false);

  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<EntryForm>();

  React.useEffect(() => {
    if (typeof shop !== 'undefined') return;

    const f = async () => {
      const res = await fetch(`/api/shop/detail?id=${hotppepper}`);

      if (res.ok) {
        setShop((await res.json()) as Shop);
      }

      setRequest(true);
    };

    f();
  }, []);

  const onSubmit: SubmitHandler<EntryForm> = async data => {
    if (typeof shop === 'undefined') return;

    const form = new FormData();

    form.append('hotppepper', shop.id);
    form.append('title', data.title);
    if (typeof data.body !== 'undefined') {
      form.append('body', data.body);
    }

    const resp = await fetch('/api/entry', {method: 'POST', body: form});

    if (resp.ok) {
      toast({
        status: 'info',
        title: '募集を作成しました',
      });
      router.push('/profile');
    } else {
      toast({
        status: 'error',
        title: '作成できませんでした',
        description: await resp.text(),
      });
    }
  };

  return (
    <Box>
      <Heading textAlign="center" my="1rem">
        募集を追加する
      </Heading>
      <Skeleton isLoaded={request}>
        <Center>
          <Box
            minH="200px"
            boxShadow="0px 5px 16px -2px #A0AEC0"
            w="95%"
            mb="1.5rem"
            borderRadius="30px"
          >
            {shop ? (
              <Flex w="100%" minH="200px">
                <Center>
                  <Avatar size="lg" src={shop.photo.pc.m} mx="1rem" />
                </Center>
                <Box h="100%">
                  <Badge mt="2rem">{shop.genre.name}</Badge>
                  <Flex alignItems="center">
                    <Heading
                      fontSize="1.2rem"
                      mt=".3rem"
                      mr=".5rem"
                      maxWidth="560px"
                    >
                      {shop.name}
                    </Heading>
                  </Flex>

                  <Box mr=".1rem" whiteSpace="normal">
                    <Text mt=".5rem">{shop.catch}</Text>
                    <Text
                      maxW="500px"
                      mt=".2rem"
                      color="gray.500"
                      fontSize=".8rem"
                    >
                      {shop.access}
                    </Text>
                  </Box>
                </Box>
              </Flex>
            ) : (
              <Center minH="200px">
                <Text
                  fontSize="2rem"
                  fontWeight="bold"
                  color="red.500"
                  textAlign="center"
                >
                  エラーで取得できません
                </Text>
              </Center>
            )}
          </Box>
        </Center>
      </Skeleton>
      <Box mx="1rem">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={Boolean(errors.title)}>
            <FormLabel htmlFor="title">募集タイトル</FormLabel>
            <Input
              id="title"
              type="text"
              placeholder="募集タイトル"
              {...register('title', {
                required: 'この項目は必須です',
              })}
            />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.body)} mt="1rem">
            <FormLabel htmlFor="body">募集タイトル</FormLabel>
            <Textarea
              id="body"
              placeholder=""
              h="200px"
              {...register('body')}
            />
            <FormErrorMessage>
              {errors.body && errors.body.message}
            </FormErrorMessage>
          </FormControl>
          <Button mt="2rem" type="submit" w="100%" isLoading={isSubmitting}>
            作成する
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default EntryFormByShop;
