import {Box, Input, InputGroup, InputRightAddon} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import React from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';

interface Form {
  keyword: string;
}

const SearchKeywordForm: React.FC = () => {
  const router = useRouter();
  const {register, handleSubmit, setValue} = useForm<Form>();

  React.useEffect(() => {
    if (typeof router.query['keyword'] === 'string') {
      setValue('keyword', router.query['keyword']);
    }
  }, [router.isReady, router.query]);

  const onSubmit: SubmitHandler<Form> = data => {
    // 全角スペースで区切るとうまく検索できないため半角スペースに置き換える
    const keyword = data.keyword.replace('　', ' ');

    router.push(`/entry/create/search?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <Box w="100%">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Input
            id="keyword"
            type="text"
            placeholder="北千住 居酒屋"
            {...register('keyword')}
          />
          <InputRightAddon as="button" type="submit">
            検索
          </InputRightAddon>
        </InputGroup>
      </form>
    </Box>
  );
};

export default SearchKeywordForm;
