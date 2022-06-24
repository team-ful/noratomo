import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  ButtonGroup,
  IconButton,
  Checkbox,
  Flex,
} from '@chakra-ui/react';
import React from 'react';
import {useFormContext, useFieldArray, useWatch} from 'react-hook-form';
import {IoAddOutline, IoRemoveOutline} from 'react-icons/io5';
import {CreateQuestionForm} from './CreateNewNoraQuestion';

const NoraQuestionAnswersForm = () => {
  const [answerIndex, setAnswerIndex] = React.useState(-1);

  const {
    control,
    register,
    clearErrors,
    formState: {errors},
  } = useFormContext<CreateQuestionForm>();
  const {fields, append, remove} = useFieldArray({
    control,
    name: 'answers',
  });
  const answers = useWatch({
    control,
    name: 'answers',
  });

  React.useEffect(() => {
    const aIndex = answers.findIndex(v => v.isAnswer);

    if (aIndex !== -1) {
      clearErrors('answers');
    }

    setAnswerIndex(aIndex);
  }, [answers]);

  return (
    <FormControl isInvalid={Boolean(errors.answers)} mt="1rem">
      <FormLabel htmlFor="answers">問題の回答と答え</FormLabel>
      {fields.map((data, index) => {
        const checkboxDisable = () => {
          // 1つもチェックがついていない場合
          if (answerIndex === -1) {
            return false;
          }

          // どれか1つにチェックがついている場合
          if (answerIndex !== index) {
            return true;
          }

          // 自分自身にチェックがついている場合
          return false;
        };

        return (
          <Flex key={`answers_key_${index}`}>
            <Input
              id="answers"
              type="text"
              placeholder={`回答 ${index + 1}`}
              my=".25rem"
              {...register(`answers.${index}.title` as const, {
                required: '回答を入力してください',
              })}
            />
            <Checkbox
              ml=".3rem"
              size="lg"
              disabled={checkboxDisable()}
              {...register(`answers.${index}.isAnswer`)}
            />
          </Flex>
        );
      })}
      <ButtonGroup size="sm" isAttached mt=".5rem">
        <IconButton
          aria-label="Add"
          icon={<IoAddOutline />}
          onClick={() => {
            if (fields.length < 5) {
              append({title: ''});
            }
          }}
        />
        <IconButton
          aria-label="Remove"
          icon={<IoRemoveOutline />}
          onClick={() => {
            if (fields.length > 1) {
              remove(-1);
            }
          }}
        />
      </ButtonGroup>
      <FormErrorMessage>
        {errors.answers && errors.answers.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default NoraQuestionAnswersForm;
