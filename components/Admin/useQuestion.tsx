import {useToast} from '@chakra-ui/react';
import React from 'react';
import {Question} from '../../utils/types';

interface Returns {
  questions: Question[];
  maxAnswerLength: number;
  getLoad: boolean;
  newQuestion: (
    title: string,
    answers: string[],
    answerIndex: number,
    score: number
  ) => Promise<void>;
  updateQuestion: (q: PutQuestion) => Promise<void>;
  removeQuestion: (id: number) => Promise<void>;
}

interface PutQuestion {
  id: number;
  question_title?: string;
  answers?: string[];
  current_answer_index?: number;
  score?: number;
}

const useQuestion = (): Returns => {
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [maxAnswerLength, setMaxAnswerLength] = React.useState(0);
  const [getLoad, setGetLoad] = React.useState(true); // 最初にgetするのでtrue

  const toast = useToast();

  // アクセスしたときに野良認証問題を取得する
  React.useEffect(() => {
    const f = async () => {
      const res = await fetch('/api/admin/nora_question');
      setGetLoad(false);

      if (!res.ok) {
        toast({
          status: 'error',
          title: await res.text(),
        });
        return;
      }

      const body: Question[] = await res.json();
      setQuestions(body);
    };

    f();
  }, []);

  // Answersの回答の最大値を求める
  React.useEffect(() => {
    if (questions.length === 0) {
      return;
    }

    const _maxAnswerLength = questions.reduce((max, v) => {
      const answerLen = v.answers.length;
      if (max < answerLen) {
        return answerLen;
      }
      return max;
    }, 0);

    setMaxAnswerLength(_maxAnswerLength);
  }, [questions]);

  // 野良認証問題を新しく作成する
  const newQuestion = async (
    title: string,
    answers: string[],
    answerIndex: number,
    score: number
  ) => {
    const b = {
      // 問題のタイトル
      question_title: title,
      // 答えの選択肢
      answers: answers,
      // 答えの回答インデックス
      current_answer_index: answerIndex,
      // この問題の重み
      score: score,
    };

    const res = await fetch('/api/admin/nora_question', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(b),
    });

    if (res.ok) {
      toast({
        status: 'info',
        title: '新しく野良認証問題を作成しました',
        description: title,
      });

      // listに追記する
      const resBody: Question = await res.json();
      setQuestions([...questions, resBody]);
    } else {
      toast({
        status: 'error',
        title: await res.text(),
      });
    }
  };

  // 野良認証問題を更新する
  const updateQuestion = async (q: PutQuestion) => {
    const res = await fetch('/api/admin/nora_question', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(q),
    });

    if (res.ok) {
      toast({
        status: 'info',
        title: '野良認証問題を更新しました',
        description: q.question_title,
      });

      // list更新する
      const newQuestions = questions.map(v => {
        const newValue = v;
        if (newValue.id === q.id) {
          if (q.question_title) {
            newValue.question_title = q.question_title;
          }
          if (q.answers) {
            newValue.answers = q.answers.map((v, i) => ({
              index: i,
              answerText: v,
            }));
          }
          if (q.current_answer_index) {
            newValue.current_answer_index = q.current_answer_index;
          }
          if (q.score) {
            newValue.score = q.score;
          }
        }

        return newValue;
      });
      setQuestions(newQuestions);
    } else {
      toast({
        status: 'error',
        title: await res.text(),
      });
    }
  };

  // 野良認証問題を削除する
  const removeQuestion = async (id: number) => {
    const res = await fetch(
      `/api/admin/nora_question?id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    if (res.ok) {
      toast({
        status: 'info',
        title: '野良認証問題を更新しました',
        description: questions.find(v => v.id === id)?.question_title,
      });

      // listから削除する
      const newQuestions = questions.filter(v => v.id !== id);
      setQuestions(newQuestions);
    } else {
      toast({
        status: 'error',
        title: await res.text(),
      });
    }
  };

  return {
    questions,
    maxAnswerLength,
    getLoad,
    newQuestion,
    updateQuestion,
    removeQuestion,
  };
};

export default useQuestion;
