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
  ModalFooter,
} from '@chakra-ui/react';
import React from 'react';
import {useForm, SubmitHandler, FormProvider} from 'react-hook-form';
import type {Question} from '../../../utils/types';
import NoraQuestionAnswersForm, {AnswersForm} from './NoraQuestionAnswersForm';
import type {PutQuestion} from './useQuestion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCloseModalOpen: () => void;
  update: (q: PutQuestion) => Promise<void>;
  defaultQuestion?: Question;
}

export interface UpdateQuestionForm extends AnswersForm {
  question_title: string;
  score: string;
}

const UpdateNoraQuestion: React.FC<Props> = ({
  isOpen,
  onClose,
  update,
  defaultQuestion,
  onCloseModalOpen,
}) => {
  const [load, setLoad] = React.useState(false);

  const methods = useForm<UpdateQuestionForm>({});

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    formState: {errors},
  } = methods;

  React.useEffect(() => {
    if (isOpen) {
      if (typeof defaultQuestion === 'undefined') {
        return;
      }

      setValue('question_title', defaultQuestion?.question_title || '');
      setValue(
        'answers',
        defaultQuestion?.answers.map((v, i) => ({
          title: v.answerText,
          isAnswer: i === defaultQuestion?.current_answer_index,
        })) || []
      );
      setValue('score', `${defaultQuestion?.score}`);
    }
  }, [defaultQuestion, isOpen]);

  const onSubmit: SubmitHandler<UpdateQuestionForm> = async data => {
    if (
      typeof defaultQuestion === 'undefined' ||
      typeof data.answers === 'undefined'
    ) {
      return;
    }

    const newAnswerIndex = data.answers.findIndex(v => v.isAnswer);

    if (newAnswerIndex === -1) {
      setError('answers', {message: '回答に答えを設定してください'});
      return;
    } else {
      clearErrors('answers');
    }

    const q: PutQuestion = {id: defaultQuestion?.id};
    let isUpdate = false;

    // 更新された場合は追加していく

    if (data.question_title !== defaultQuestion?.question_title) {
      q.question_title = data.question_title;
      isUpdate = true;
    }
    const newScore = parseInt(data.score);
    if (newScore !== defaultQuestion?.score) {
      q.score = newScore;
      isUpdate = true;
    }

    const newAnswers = data.answers.map(v => v.title);

    if (
      newAnswerIndex !== defaultQuestion?.current_answer_index ||
      defaultQuestion?.answers.length !== newAnswers.length ||
      defaultQuestion?.answers.find((v, i) => v.answerText !== newAnswers[i])
    ) {
      q.current_answer_index = newAnswerIndex;
      q.answers = newAnswers;

      isUpdate = true;
    }

    if (!isUpdate) {
      return;
    }

    setLoad(true);

    await update(q);

    setLoad(false);

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
        <ModalHeader>ID: {defaultQuestion?.id} の編集</ModalHeader>
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
              <Button mt="1rem" type="submit" w="100%" isLoading={load}>
                更新
              </Button>
            </form>
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            onClick={() => {
              onCloseModalOpen();
              onClose();
            }}
          >
            削除
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateNoraQuestion;
