import {Box, Input, InputGroup, InputRightAddon} from '@chakra-ui/react';
import React from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';

interface Props {
  searchQuery: (q: string, page: number) => void;
}

interface Form {
  keyword: string;
}

const SearchKeywordForm: React.FC<Props> = ({searchQuery}) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Form>();

  const onSubmit: SubmitHandler<Form> = data => {
    searchQuery(data.keyword, 0);
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
