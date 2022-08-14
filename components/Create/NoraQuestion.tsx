import {Box, Button, Center, Flex, Heading, Spinner} from '@chakra-ui/react';
import {Step, Steps, useSteps} from 'chakra-ui-steps';
import React from 'react';
import {
  NoraQuestionAnswer,
  NoraQuestionExternal,
  NoraSession,
} from '../../utils/types';

interface Props {
  session: NoraSession;
  getQuestion: (id: number) => Promise<NoraQuestionExternal | null>;
  result: (answers: NoraQuestionAnswer[]) => void;
}

const NoraQuestion: React.FC<Props> = ({session, getQuestion, result}) => {
  const [questions, setQuestions] = React.useState<NoraQuestionExternal[]>([]);
  const [currentQuestion, setCurrentQuestion] =
    React.useState<NoraQuestionExternal>();
  const [answers, setAnswers] = React.useState<NoraQuestionAnswer[]>([]);

  const {nextStep, activeStep} = useSteps({
    initialStep: 0,
  });

  React.useEffect(() => {
    const f = async () => {
      const questions = [];
      for (const id of session.question_ids) {
        const question = await getQuestion(id);
        if (question !== null) {
          questions.push(question);
        }
      }

      setQuestions(questions);
      setCurrentQuestion(questions[0]);
    };

    f();
  }, []);

  const answer = (answerIndex: number) => {
    const a = [...answers];
    a.push({id: currentQuestion?.id ?? NaN, answer_index: answerIndex});
    setAnswers(a);

    if (session.question_ids.length > activeStep + 1) {
      setCurrentQuestion(questions[activeStep + 1]);
    } else {
      setCurrentQuestion(undefined);
      result(a);
    }

    nextStep();
  };

  return (
    <Flex flexDir="column" width="100%">
      <Heading textAlign="center" my="2rem">
        野良認証
      </Heading>
      <Steps activeStep={activeStep} colorScheme="orange">
        {session.question_ids.map((_, i) => (
          <Step label={`問題${i + 1}`} key={i} />
        ))}
      </Steps>
      {typeof currentQuestion !== 'undefined' ? (
        <QuestionContent question={currentQuestion} answer={answer} />
      ) : (
        <Center h="50vh">
          <Spinner size="lg" color="orange.500" />
        </Center>
      )}
    </Flex>
  );
};

const QuestionContent: React.FC<{
  question: NoraQuestionExternal;
  answer: (answerIndex: number) => void;
}> = ({question, answer}) => {
  return (
    <Box mt="2rem">
      <Heading textAlign="center" mb="2rem">
        Q. {question?.question_title}
      </Heading>
      {question.answers.map(v => {
        return (
          <Button
            onClick={() => answer(v.index)}
            key={v.index}
            w="100%"
            my=".5rem"
          >
            {v.answerText}
          </Button>
        );
      })}
    </Box>
  );
};

export default NoraQuestion;
