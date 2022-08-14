import {RowDataPacket} from 'mysql2';
import {testApiHandler} from 'next-test-api-route-handler';
import {handlerWrapper} from '../../src/base/handlerWrapper';
import {initNoraQuestionHandler} from '../../src/question/init';
import {createNoraQuestion} from '../../src/services/noraQuestion';
import TestBase from '../../src/tests/base';

describe('init', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('取得できる', async () => {
    for (let i = 0; 5 > i; i++) {
      await createNoraQuestion(
        base.db,
        'title',
        [{index: 0, answerText: ''}],
        0,
        100
      );
    }

    const h = handlerWrapper(initNoraQuestionHandler, 'GET');

    await testApiHandler({
      handler: h,
      url: `?keyword=${encodeURIComponent('カフェ レイクタウン')}`,
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);

        const body = await res.json();

        const result = await base.db.test<RowDataPacket[]>(
          'SELECT * FROM nora_session WHERE token = ?',
          [body.token]
        );

        expect(result.length).toBe(1);

        expect(body.question_ids.length).toBe(5);
      },
    });
  });
});
