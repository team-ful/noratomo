import {
  FormControl,
  FormLabel,
  Input,
  InputLeftAddon,
  InputGroup,
  Button,
  NumberInput,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
  Textarea,
  NumberInputField,
  FormErrorMessage,
  useToast,
  Select,
  Center,
  Box,
  Flex,
} from '@chakra-ui/react';
import React from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import {useRecoilState} from 'recoil';
import {UserState} from '../../utils/atom';
import {User} from '../../utils/types';
import SettingAvatar from './SettingAvatar';

type SettingInputs = {
  display_name: string;
  user_name: string;
  mail: string;
  profile: string;
  age: number;
  gender: number;
};

const SettingProfile = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<SettingInputs>();

  const [user, setUser] = useRecoilState(UserState);
  const toast = useToast();

  React.useEffect(() => {
    if (user) {
      setValue('display_name', user.display_name);
      setValue('user_name', user.user_name);
      setValue('mail', user.mail);
      setValue('profile', user.profile);
      setValue('age', user.age);

      // 性別を指定していない場合は0なのでそのときはデフォルト値には入れない
      if (user.gender !== 0) {
        setValue('gender', user.gender);
      }
    }
  }, [user]);

  const onSubmit: SubmitHandler<SettingInputs> = async data => {
    if (typeof user === 'undefined' || user === null) {
      return;
    }

    const body: {[key: string]: string | number} = {};
    const formattedBody: string[] = [];
    const u: User = {...user};

    if (user?.user_name !== data.user_name) {
      body.user_name = data.user_name;
      u.user_name = data.user_name;
    }
    if (user?.mail !== data.mail) {
      body.mail = data.mail;
      u.mail = data.mail;
    }
    if (user?.profile !== data.profile) {
      body.profile = data.profile;
      u.profile = data.profile;
    }
    if (user?.age !== data.age) {
      body.age = data.age;
      u.age = data.age;
    }
    if (user?.gender !== data.gender) {
      body.gender = data.gender;
      u.gender = data.gender;
    }
    if (user?.display_name !== data.display_name) {
      body.display_name = data.display_name;
      u.display_name = data.display_name;
    }

    for (const b in body) {
      formattedBody.push(`${b}=${encodeURIComponent(body[b])}`);
    }

    if (formattedBody.length === 0) {
      return;
    }

    const res = await fetch('/api/user/config', {
      method: 'PUT',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: formattedBody.join('&'),
    });

    if (res.ok) {
      toast({
        title: '更新しました',
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
        <Center my="1.5rem">
          <SettingAvatar />
        </Center>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={Boolean(errors.display_name)}>
            <FormLabel htmlFor="display_name">表示名</FormLabel>
            <Input
              id="display_name"
              placeholder="新しい表示名を入力"
              {...register('display_name', {
                required: 'ナナシさんはダメです',
                minLength: {
                  value: 3,
                  message: '最低4文字以上にして下さい',
                },
                maxLength: {
                  value: 16,
                  message: '最大で16字までにして下さい',
                },
              })}
            />
            <FormErrorMessage>
              {errors.display_name && errors.display_name.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.user_name)} mt="1.2rem">
            <FormLabel htmlFor="user_name">ユーザー名</FormLabel>
            <InputGroup>
              <InputLeftAddon>@</InputLeftAddon>
              <Input
                id="user_name"
                placeholder="新しいユーザー名を入力"
                {...register('user_name', {
                  required: 'ナナシさんはダメです',
                  minLength: {
                    value: 3,
                    message: '最低4文字以上にして下さい',
                  },
                  maxLength: {
                    value: 16,
                    message: '最大で16字までにして下さい',
                  },
                  pattern: {
                    value: /^[0-9a-zA-Z_-]+$/,
                    message: 'アルファベット、数字、-、_のみ変更して下さい。',
                  },
                })}
              />
            </InputGroup>
            <FormErrorMessage>
              {errors.user_name && errors.user_name.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.profile)} mt="1.2rem">
            <FormLabel htmlFor="profile">プロフィール</FormLabel>
            <Textarea
              size="lg"
              placeholder="あなたのプロフィールを入力しましょう"
              id="profile"
              {...register('profile', {
                maxLength: {
                  value: 128,
                  message: '128文字まで表現して下さい',
                },
              })}
            />
            <FormErrorMessage>
              {errors.profile && errors.profile.message}
            </FormErrorMessage>
          </FormControl>
          <Flex mt="1.2rem">
            <FormControl isInvalid={Boolean(errors.age)}>
              <FormLabel htmlFor="age">年齢</FormLabel>
              <NumberInput defaultValue={user?.age}>
                <NumberInputField
                  id="age"
                  placeholder="年齢"
                  {...register('age', {
                    required: '年齢を入力してください',
                    min: {
                      value: 18,
                      message: '年齢は0歳以上です',
                    },
                    max: {
                      value: 149,
                      message: '年齢は150歳未満で入力してください',
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

            <FormControl isInvalid={Boolean(errors.gender)} ml=".5rem">
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
export default SettingProfile;
