import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputLeftAddon,
  InputGroup,
  HStack,
  VStack,
  Button,
  NumberInput,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
  Textarea,
  Switch,
  NumberInputField,
  Text,
  FormErrorMessage,
  useToast,
  Select,
  Tab,
  TabList,
  Tabs,
  Box,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import router from 'next/router';
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

const SettingForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitSuccessful},
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
    const newUser = user;

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
    <Box>
      <Tabs>
        <TabList>
          <Tab>プロフィール</Tab>
          <Tab>パスワード</Tab>
          <Tab>メールアドレス</Tab>
          <Tab>通知</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing="">
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={Boolean(errors.user_name)}>
                  <FormLabel htmlFor="user_name">ユーザーネーム</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>@</InputLeftAddon>
                    <Input
                      id="user_name"
                      placeholder="user_name"
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
                      })}
                    />
                  </InputGroup>
                  <FormHelperText>
                    他の利用者に表示される名前です。
                  </FormHelperText>
                  <FormErrorMessage>
                    {errors.user_name && errors.user_name.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={Boolean(errors.age)}>
                  <FormLabel htmlFor="age">年齢</FormLabel>
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

                <FormControl isInvalid={Boolean(errors.gender)}>
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

                <FormControl isInvalid={Boolean(errors.gender)}>
                  <FormLabel htmlFor="profile">プロフィール</FormLabel>
                  <Textarea
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

                <Button isLoading={isSubmitSuccessful} type="submit">
                  これで設定する
                </Button>
              </form>
            </VStack>
          </TabPanel>
          <TabPanel>
            {/* <FormControl>
          <FormLabel>新しいパスワードを設定</FormLabel>
          <Input id="" type="" placeholder="新しいパスワードを入力" />
          <p>以前のパスワード：{}</p>
          </FormControl>*/}
          </TabPanel>
          <TabPanel>
            {/* <FormControl isInvalid={Boolean(errors.mail)}>
            <FormLabel htmlFor="mail">メールアドレス</FormLabel>
            <Input
            id="mail"
            placeholder="mail"
            {...register('mail', {
            required: '有効なアドレスを登録して下さい。',
            pattern:
            /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
            })}
            />
            <FormHelperText>
            ドットはアドレスの頭と尻尾に使用できず、連続で使用できません。
            </FormHelperText>
            <FormErrorMessage>
            {errors.mail && errors.mail.message}
            </FormErrorMessage>
            </FormControl> */}
          </TabPanel>
          <TabPanel>
            {/*<FormControl display="flex" alignItems="center">
            <FormLabel>ページ内での通知を有効にする</FormLabel>
            <Switch id="" />
            </FormControl>
            <FormControl display="flex" alignItems="center">
            <FormLabel>メール通知を有効にする</FormLabel>
            <Switch id="" />
            </FormControl> */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SettingForm;
