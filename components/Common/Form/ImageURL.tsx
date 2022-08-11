import {
  FormControl,
  FormLabel,
  Flex,
  Input,
  FormErrorMessage,
  Avatar,
} from '@chakra-ui/react';
import React from 'react';
import {useFormContext} from 'react-hook-form';

export interface ImageURLForm {
  photo?: string;
}

const ImageURL = () => {
  const [url, setURL] = React.useState('');

  const {
    register,
    formState: {errors},
  } = useFormContext<ImageURLForm>();

  return (
    <FormControl isInvalid={Boolean(errors.photo)} mt="1rem">
      <FormLabel htmlFor="photo">お店の画像URL（オプション）</FormLabel>
      <Flex alignItems="center">
        <Input
          id="photo"
          type="url"
          placeholder="https://"
          {...register('photo')}
          onChange={v => {
            setURL(v.target.value);
          }}
        />
        <Avatar size="md" ml=".5rem" src={url} />
      </Flex>
      <FormErrorMessage>
        {errors.photo && errors.photo.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default ImageURL;
