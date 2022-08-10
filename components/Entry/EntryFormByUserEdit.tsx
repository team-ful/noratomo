import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  useToast,
  FormErrorMessage,
  Divider,
  Switch,
} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import {useForm, SubmitHandler, FormProvider} from 'react-hook-form';
import ImageURL, {ImageURLForm} from '../Common/Form/ImageURL';
import Map, {MapForm} from '../Common/Form/Map';

interface EntryForm extends MapForm, ImageURLForm {
  title: string;
  body?: string;

  // shop data
  shop_name: string;
  shop_address: string;
  genre_name: string;
  gender: boolean;
  site_url: string;
}

const EntryFormByUserEdit = () => {
  const router = useRouter();
  const toast = useToast();
  const methods = useForm<EntryForm>();
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = methods;

  const onSubmit: SubmitHandler<EntryForm> = async data => {
    const form = new FormData();

    form.append('shop_name', data.shop_name);
    form.append('shop_address', data.shop_address);
    form.append('lat', String(data.lat));
    form.append('lon', String(data.lon));
    form.append('genre_name', data.genre_name);
    form.append('gender', data.gender ? 'true' : 'false');
    form.append('site_url', data.site_url);
    if (typeof data.photo !== 'undefined') {
      form.append('photo', data.photo);
    }

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

      <Box mx="1rem">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Heading fontSize="1.5rem" mb=".5rem">
              お店の情報
            </Heading>
            <FormControl isInvalid={Boolean(errors.shop_name)} mt="1rem">
              <FormLabel htmlFor="shop_name">店名</FormLabel>
              <Input
                id="shop_name"
                type="text"
                placeholder="店名"
                {...register('shop_name', {
                  required: 'この項目は必須です',
                })}
              />
              <FormErrorMessage>
                {errors.shop_name && errors.shop_name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.shop_address)} mt="1rem">
              <FormLabel htmlFor="shop_address">お店の住所</FormLabel>
              <Input
                id="shop_address"
                type="text"
                placeholder="お店の住所"
                {...register('shop_address', {
                  required: 'この項目は必須です',
                })}
              />
              <FormErrorMessage>
                {errors.shop_address && errors.shop_address.message}
              </FormErrorMessage>
            </FormControl>
            <Map
              style={{
                width: '100%',
                height: '400px',
              }}
              center={{
                lat: 35.39,
                lng: 139.44,
              }}
              zoom={6}
            >
              お店の場所（ピンを刺す）
            </Map>
            <FormControl isInvalid={Boolean(errors.genre_name)} mt="1rem">
              <FormLabel htmlFor="genre_name">お店の種類</FormLabel>
              <Input
                id="genre_name"
                type="text"
                placeholder="居酒屋"
                {...register('genre_name', {
                  required: 'この項目は必須です',
                })}
              />
              <FormErrorMessage>
                {errors.genre_name && errors.genre_name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.site_url)} mt="1rem">
              <FormLabel htmlFor="site_url">お店のサイトURL</FormLabel>
              <Input
                id="site_url"
                type="url"
                placeholder="https://"
                {...register('site_url', {
                  required: 'この項目は必須です',
                })}
              />
              <FormErrorMessage>
                {errors.site_url && errors.site_url.message}
              </FormErrorMessage>
            </FormControl>
            <ImageURL />
            <FormControl
              isInvalid={Boolean(errors.gender)}
              mt="1rem"
              display="flex"
              alignItems="center"
            >
              <FormLabel htmlFor="gender" m="0">
                性別による入場可否
              </FormLabel>
              <Switch ml="1rem" id="gender" {...register('gender')} />
              <FormErrorMessage m=" 0 0 0 1rem">
                {errors.gender && errors.gender.message}
              </FormErrorMessage>
            </FormControl>
            <Divider my="1.5rem" />
            <Heading fontSize="1.5rem" mt="1rem" mb=".5rem">
              募集の情報
            </Heading>
            <FormControl isInvalid={Boolean(errors.title)} mt="1rem">
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
        </FormProvider>
      </Box>
    </Box>
  );
};

export default EntryFormByUserEdit;
