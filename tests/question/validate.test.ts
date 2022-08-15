import {validateNoraQuestion} from '../../src/question/validate';
import TestBase from '../../src/tests/base';

describe('validate', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('正解したものにスコアが加算される', async () => {
    const {token, answers} = await base.noraSession(300, 3);

    const score = await validateNoraQuestion(
      base.db,
      token,
      answers.map((v, i) => {
        if (i === 2) {
          return {
            ...v,
            answer_index: 1000000000,
          };
        }

        return v;
      })
    );

    expect(score).toBe(300 * 2);
  });
});
