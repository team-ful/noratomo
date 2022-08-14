import {testApiHandler} from 'next-test-api-route-handler';
import {handlerWrapper} from '../../src/base/handlerWrapper';
import {getNoraQuestionHandler} from '../../src/question/get';
import {createNoraQuestion} from '../../src/services/noraQuestion';
import TestBase from '../../src/tests/base';

describe('get', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('取得できる', async () => {
    const q = await createNoraQuestion(
      base.db,
      'title',
      [{index: 0, answerText: ''}],
      0,
      100
    );

    const h = handlerWrapper(getNoraQuestionHandler, 'GET');

    await testApiHandler({
      handler: h,
      url: `?id=${q.id}`,
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.id).toBe(q.id);
        expect(body.question_title).toBe('title');
      },
    });
  });
});
