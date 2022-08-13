import {randomInt} from 'crypto';
import {
  NoraQuestion,
  NoraQuestionExternal,
  NoraQuestionModel,
  NoraQuestionSelect,
} from '../../src/models/noraQuestion';

describe('noraQuestion', () => {
  const answers: NoraQuestionSelect[] = [
    {
      index: 0,
      answerText: 'hogehoge',
    },
    {
      index: 1,
      answerText: 'hugahuga',
    },
  ];
  const id = randomInt(20);
  const title = 'nyaaa';
  const answerIndex = 1;
  const score = 90;

  test('作成できる', () => {
    const q = new NoraQuestion({
      id: id,
      question_title: title,
      answers: answers,
      current_answer_index: answerIndex,
      score: score,
    });

    expect(q.id).toBe(id);
    expect(q.question_title).toBe(title);
    expect(q.current_answer_index).toBe(answerIndex);
    expect(q.score).toBe(score);
  });

  test('回答を返す', () => {
    const q = new NoraQuestion({
      id: id,
      question_title: title,
      answers: answers,
      current_answer_index: answerIndex,
      score: score,
    });

    expect(q.answer).toBe(answers[answerIndex]);
  });

  test('回答のインデックスが正しい', () => {
    const q = new NoraQuestion({
      id: id,
      question_title: title,
      answers: answers,
      current_answer_index: answerIndex,
      score: score,
    });

    expect(q.checkAnswer()).toBe(true);
  });

  test('回答のインデックスが範囲外だとfalse', () => {
    const q = new NoraQuestion({
      id: id,
      question_title: title,
      answers: answers,
      current_answer_index: 10000, // 範囲外
      score: score,
    });

    expect(q.checkAnswer()).toBe(false);
  });

  test('回答のインデックスが0より小さいとfalse', () => {
    const q = new NoraQuestion({
      id: id,
      question_title: title,
      answers: answers,
      current_answer_index: -100, // 負の値のインデックスは理論上ありえない
      score: score,
    });

    expect(q.checkAnswer()).toBe(false);
  });

  test('回答が存在しない場合はundefined', () => {
    const q = new NoraQuestion({
      id: id,
      question_title: title,
      answers: [], // 回答が存在しない
      current_answer_index: answerIndex,
      score: score,
    });

    expect(q.checkAnswer()).toBeUndefined();
  });

  test('getModel', () => {
    const q = new NoraQuestion({
      id: id,
      question_title: title,
      answers: answers,
      current_answer_index: answerIndex,
      score: score,
    });

    const m: NoraQuestionModel = {
      id: id,
      question_title: title,
      answers: answers,
      current_answer_index: answerIndex,
      score: score,
    };

    expect(q.model).toEqual(m);
  });

  test('external', () => {
    const q = new NoraQuestion({
      id: id,
      question_title: title,
      answers: answers,
      current_answer_index: answerIndex,
      score: score,
    });

    const m: NoraQuestionExternal = {
      id: id,
      question_title: title,
      answers: answers,
    };

    expect(q.external).toEqual(m);
  });
});
