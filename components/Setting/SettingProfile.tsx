import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputLeftAddon,
  InputGroup,
  HStack,
  Stack,
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
  Heading,
  Spacer,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import {useRecoilState} from 'recoil';
import {UserState} from '../../utils/atom';
import {User} from '../../utils/types';

type SettingInputs = {
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
    formState: {errors, isSubmitting, isValid, isDirty},
  } = useForm<SettingInputs>();

  const [user, setUser] = useRecoilState(UserState);
  const toast = useToast();

  React.useEffect(() => {
    if (user) {
      setValue('user_name', user.user_name);
      setValue('mail', user.mail);
      setValue('profile', user.profile);
      setValue('age', user.age);
      setValue('gender', user.gender);
    }
  }, [user]);

  const onSubmit: SubmitHandler<SettingInputs> = async data => {
    const body: {[key: string]: string | number} = {};
    const formattedBody: string[] = [];
    // const newUser = user;

    if (user?.user_name !== data.user_name) {
      body.user_name = data.user_name;
    }
    if (user?.mail !== data.mail) {
      body.mail = data.mail;
    }
    if (user?.profile !== data.profile) {
      body.profile = data.profile;
    }
    if (user?.age !== data.age) {
      body.age = data.age;
    }
    if (user?.gender !== data.gender) {
      body.gender = data.gender;
    }

    for (const b in body) {
      formattedBody.push(`${b}=${encodeURIComponent(body[b])}`);
      // newUser[b as keyof User] = body[b];
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
      // setUser(newUser);
    } else {
      toast({
        title: await res.text(),
        status: 'error',
      });
    }
  };

  return (
    <div>
      <Heading size="lg" textAlign="center" mb="1rem">
        プロフィール変更
      </Heading>
      {/* プロフィールの変更 */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Box>
            <FormControl isInvalid={Boolean(errors.user_name)}>
              <FormLabel htmlFor="user_name" fontSize="lg">
                現在のユーザー名を変更
              </FormLabel>
              <InputGroup>
                <InputLeftAddon>@</InputLeftAddon>
                <Input
                  id="user_name"
                  placeholder="新しい名前を入力
                          "
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
              <FormHelperText>他の利用者に表示される名前です。</FormHelperText>
              <FormErrorMessage>
                {errors.user_name && errors.user_name.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Spacer />
          <Box>
            <FormControl isInvalid={Boolean(errors.gender)}>
              <FormLabel htmlFor="profile" textAlign="center">
                コメント(BIO)
              </FormLabel>
              <Textarea
                size="lg"
                placeholder="あなたのプロフィールを入力しましょう"
                id="profile"
                {...register('profile', {
                  required: 'あなたを表現してみましょう',
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
          </Box>
          <Spacer />
          <Box>
            <HStack>
              <Box>
                <FormControl isInvalid={Boolean(errors.age)} w="100px">
                  <FormLabel htmlFor="age" textAlign="center">
                    年齢
                  </FormLabel>
                  <NumberInput>
                    <NumberInputField
                      id="age"
                      placeholder="age"
                      type="number"
                      {...register('age', {
                        required: '18から100歳の範囲で入力して下さい',
                        min: 18,
                        max: 100,
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
              </Box>
              <Spacer />
              <Box>
                <FormControl isInvalid={Boolean(errors.gender)} w="160px">
                  <FormLabel htmlFor="gender" textAlign="center">
                    性別
                  </FormLabel>
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
              </Box>
            </HStack>
          </Box>
        </Stack>
        <Button
          disabled={!isValid && !isDirty}
          isLoading={isSubmitting}
          type="submit"
          size="lg"
          marginTop="2rem"
        >
          保存
        </Button>
      </form>
    </div>
  );
};
export default SettingProfile;
