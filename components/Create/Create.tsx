import React from 'react';
import {NoraQuestionAnswer} from '../../utils/types';
import CreateAccount from './Account';
import NoraQuestion from './NoraQuestion';
import useNoraQuestion from './useNoraQuestion';

const Create = () => {
  const [answers, setAnswers] = React.useState<NoraQuestionAnswer[]>([]);
  const [answered, setAnswered] = React.useState(false);
  const {session, getQuestion} = useNoraQuestion();

  const resultQuestion = (answers: NoraQuestionAnswer[]) => {
    setAnswers(answers);

    setTimeout(() => {
      setAnswered(true);
    }, 500);
  };

  return (
    <>
      {answered ? (
        <CreateAccount token={session?.token || ''} answers={answers} />
      ) : (
        <>
          {session && (
            <NoraQuestion
              session={session}
              getQuestion={getQuestion}
              result={resultQuestion}
            />
          )}
        </>
      )}
    </>
  );
};

export default Create;
