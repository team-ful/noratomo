import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import React from 'react';
import {useForm, SubmitHandler, FormProvider} from 'react-hook-form';
import NoraQuestionAnswersForm from './NoraQuestionAnswersForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  create: (
    title: string,
    answers: string[],
    answerIndex: number,
    score: number
  ) => Promise<void>;
}

export interface CreateQuestionForm {
  question_title: string;
  answers: {
    title: string;
    isAnswer: boolean;
  }[];
  score: number;
}

const CreateNewNoraQuestion: React.FC<Props> = ({isOpen, onClose, create}) => {
  const methods = useForm<CreateQuestionForm>({
    defaultValues: {score: 100, answers: [{title: ''}]},
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: {errors, isSubmitSuccessful},
  } = methods;

  const onSubmit: SubmitHandler<CreateQuestionForm> = async data => {
    const answerIndex = data.answers.findIndex(v => v.isAnswer);

    if (answerIndex === -1) {
      setError('answers', {message: '回答に答えを設定してください'});
      return;
    } else {
      clearErrors('answers');
    }

    await create(
      data.question_title,
      data.answers.map(v => v.title),
      data.answers.findIndex(v => v.isAnswer),
      data.score
    );

    onClose();
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        reset();
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>野良認証問題を作成します</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={Boolean(errors.question_title)}>
                <FormLabel htmlFor="question_title">問題のタイトル</FormLabel>
                <Input
                  id="question_title"
                  type="text"
                  placeholder="問題のタイトル"
                  {...register('question_title', {
                    required: '問題のタイトルを入力してください',
                  })}
                />
                <FormErrorMessage>
                  {errors.question_title && errors.question_title.message}
                </FormErrorMessage>
              </FormControl>
              <NoraQuestionAnswersForm />
              <FormControl
                isInvalid={Boolean(errors.score)}
                mt="1rem"
                mr=".5rem"
              >
                <FormLabel htmlFor="score">スコア</FormLabel>
                <NumberInput id="score" placeholder="スコア" min={0}>
                  <NumberInputField
                    {...register('score', {
                      required: 'スコアを入力してください',
                      min: {
                        value: 0,
                        message: 'スコアは0以上です',
                      },
                    })}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>
                  {errors.score && errors.score.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                mt="1rem"
                colorScheme="blue"
                type="submit"
                w="100%"
                isLoading={isSubmitSuccessful}
              >
                追加
              </Button>
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateNewNoraQuestion;
