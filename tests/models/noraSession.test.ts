import {ResultSetHeader} from 'mysql2';
import {NoraQuestionSelect} from '../../src/models/noraQuestion';
import {NoraSession} from '../../src/models/noraSession';
import TestBase from '../../src/tests/base';
import {randomText} from '../../src/utils/random';

describe('noraSession', () => {
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
  const title = 'nyaaa';
  const answerIndex = 1;
  const score = 90;

  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('ids', () => {
    const noraSession = new NoraSession({
      token: randomText(10),
      question_ids: '10, 20, 30',
    });

    expect(noraSession.ids).toEqual([10, 20, 30]);
  });

  test('noraQuestions', async () => {
    const id1 = (
      await base.db.test<ResultSetHeader>(
        `INSERT INTO nora_question(
      question_title,
      answers,
      current_answer_index,
      score
    ) VALUES (?, ?, ?, ?)`,
        [title, JSON.stringify(answers), answerIndex, score]
      )
    ).insertId;

    const noraSession = new NoraSession({
      token: randomText(10),
      question_ids: `${id1}`,
    });

    const q = await noraSession.noraQuestions(base.db);

    expect(q.length).toBe(1);
    expect(q[0].question_title).toBe(title);
  });
});
