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
import {useForm, SubmitHandler, FormProvider} from 'react-hook-form';
import {dateString} from '../../utils/parse';
import {Shop} from '../../utils/types';
import Map, {MapForm} from '../Common/Form/Map';

interface EntryForm extends MapForm {
  title: string;
  body?: string;
  meet_date: string;
}

interface Props {
  hotppepper: string;
}

const EntryFormByShop: React.FC<Props> = ({hotppepper}) => {
  const [shop, setShop] = React.useState<Shop>();
  const [request, setRequest] = React.useState(false);

  const router = useRouter();
  const toast = useToast();
  const methods = useForm<EntryForm>({
    defaultValues: {meet_date: dateString(new Date(), true)},
  });
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: {errors, isSubmitting},
  } = methods;

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

    if (!data.map) {
      setError('map', {
        message: 'お店の場所にピンを刺してください',
      });
      return;
    } else {
      clearErrors('map');
    }

    const form = new FormData();

    form.append('hotppepper', shop.id);
    form.append('title', data.title);
    form.append('meet_date', new Date(data.meet_date).toISOString());
    form.append('meeting_lat', String(data.lat));
    form.append('meeting_lon', String(data.lon));
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
        <FormProvider {...methods}>
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
              <FormLabel htmlFor="body">募集詳細</FormLabel>
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
            <FormControl isInvalid={Boolean(errors.meet_date)} mt="1rem">
              <FormLabel htmlFor="meet_date">待ち合わせ日時</FormLabel>
              <Input
                id="meet_date"
                type="datetime-local"
                {...register('meet_date', {
                  required: 'この項目は必須です',
                })}
              />
              <FormErrorMessage>
                {errors.meet_date && errors.meet_date.message}
              </FormErrorMessage>
            </FormControl>
            <Map
              style={{
                width: '100%',
                height: '400px',
              }}
              center={
                typeof shop !== 'undefined'
                  ? {
                      lat: shop.lat,
                      lng: shop.lng,
                    }
                  : undefined
              }
              zoom={15}
            >
              待ち合わせ場所（ピンを刺す）
            </Map>
            <Button mt="2rem" type="submit" w="100%" isLoading={isSubmitting}>
              作成する
            </Button>
          </form>
        </FormProvider>
      </Box>
    </Box>
  );
};

export default EntryFormByShop;
