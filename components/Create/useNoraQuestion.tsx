import {useToast} from '@chakra-ui/react';
import React from 'react';
import {NoraQuestionExternal, NoraSession} from '../../utils/types';

interface Returns {
  session: NoraSession | undefined;
  getQuestion: (id: number) => Promise<NoraQuestionExternal | null>;
}

const useNoraQuestion = (): Returns => {
  const [session, setSession] = React.useState<NoraSession>();

  const toast = useToast();

  React.useEffect(() => {
    const f = async () => {
      const res = await fetch('/api/nora_question/init', {method: 'GET'});

      if (res.ok) {
        const body: NoraSession = await res.json();
        setSession(body);
      } else {
        toast({
          status: 'error',
          title: 'エラー',
          description: await res.text(),
        });
      }
    };

    f();
  }, []);

  const getQuestion = async (
    id: number
  ): Promise<NoraQuestionExternal | null> => {
    if (typeof session === 'undefined') {
      toast({
        status: 'error',
        title: 'エラー',
      });
      return null;
    }

    const res = await fetch(`/api/nora_question?id=${encodeURIComponent(id)}`);

    if (res.ok) {
      return (await res.json()) as NoraQuestionExternal;
    } else {
      toast({
        status: 'error',
        title: 'エラー',
        description: await res.text(),
      });
      return null;
    }
  };

  return {
    session,
    getQuestion,
  };
};

export default useNoraQuestion;
