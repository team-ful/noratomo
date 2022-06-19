import {randomInt} from 'crypto';
import mysql from 'mysql2/promise';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../config';
import {get, post, put, _delete} from '../../src/admin/noraQuestion';
import {NoraQuestion, NoraQuestionModel} from '../../src/models/noraQuestion';
import {
  createNoraQuestion,
  findNoraQuestionById,
} from '../../src/services/noraQuestion';
import {TestUser} from '../../src/tests/user';

describe('noraQuestion', () => {
  let db: mysql.Connection;
  const user = new TestUser({is_admin: true});
  const normalUser = new TestUser();

  const dummyQuestion: NoraQuestionModel = {
    id: NaN,
    question_title: 'hogehoge',
    answers: [
      {
        index: 0,
        answerText: 'aaaa',
      },
      {
        index: 1,
        answerText: 'bbbb',
      },
    ],
    current_answer_index: 0,
    score: 100,
  };

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();

    await user.create(db);
    await user.addSession(db);

    await normalUser.create(db);
    await normalUser.addSession(db);
  });

  afterAll(async () => {
    await db.end();
  });

  test('get', async () => {
    expect.hasAssertions();

    const question = await createNoraQuestion(
      db,
      dummyQuestion.question_title,
      dummyQuestion.answers,
      dummyQuestion.current_answer_index,
      dummyQuestion.score
    );

    await testApiHandler({
      handler: get,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.sessionCookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const d = await res.json();

        // 存在する
        expect(d.find(v => v.id === question.id)).not.toBeUndefined();
      },
    });
  });

  test('getで管理者以外は403', async () => {
    await testApiHandler({
      handler: get,
      requestPatcher: async req => {
        req.headers = {
          cookie: normalUser.sessionCookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(403);
      },
    });
  });

  test('getでlimitあり', async () => {
    expect.hasAssertions();

    // 3個追加する
    for (let i = 0; 3 > i; ++i) {
      await createNoraQuestion(
        db,
        dummyQuestion.question_title,
        dummyQuestion.answers,
        dummyQuestion.current_answer_index,
        dummyQuestion.score
      );
    }

    await testApiHandler({
      handler: get,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.sessionCookie,
        };
      },
      url: '/?limit=2',
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const d = await res.json();

        expect(d.length).toBe(2);
      },
    });
  });

  test('post', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: post,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.sessionCookie,
          'content-type': 'application/json',
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          body: JSON.stringify({
            question_title: dummyQuestion.question_title,
            answers: [
              dummyQuestion.answers[0].answerText,
              dummyQuestion.answers[1].answerText,
            ],
            current_answer_index: dummyQuestion.current_answer_index,
            score: dummyQuestion.score,
          }),
        });
        expect(res.status).toBe(200);

        const d = await res.json();

        const q = findNoraQuestionById(db, d.id);

        expect(q).not.toBeNull();
      },
    });
  });

  test('postで管理者以外は403', async () => {
    await testApiHandler({
      handler: post,
      requestPatcher: async req => {
        req.headers = {
          cookie: normalUser.sessionCookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(403);
      },
    });
  });

  test('postでフォームが完全でないとエラー: answers', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: post,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.sessionCookie,
          'content-type': 'application/json',
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          body: JSON.stringify({
            question_title: dummyQuestion.question_title,
            current_answer_index: dummyQuestion.current_answer_index,
            score: dummyQuestion.score,
          }),
        });
        expect(res.status).toBe(400);
      },
    });
  });

  test('postでフォームが完全でないとエラー: score', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: post,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.sessionCookie,
          'content-type': 'application/json',
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          body: JSON.stringify({
            question_title: dummyQuestion.question_title,
            answers: [
              dummyQuestion.answers[0].answerText,
              dummyQuestion.answers[1].answerText,
            ],
            current_answer_index: dummyQuestion.current_answer_index,
          }),
        });
        expect(res.status).toBe(400);
      },
    });
  });

  test('postでcurrent_answer_indexが範囲外だとエラー', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: post,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.sessionCookie,
          'content-type': 'application/json',
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          body: JSON.stringify({
            question_title: dummyQuestion.question_title,
            answers: [
              dummyQuestion.answers[0].answerText,
              dummyQuestion.answers[1].answerText,
            ],
            current_answer_index: 100,
          }),
        });
        expect(res.status).toBe(400);
      },
    });
  });

  test('put', async () => {
    expect.hasAssertions();

    const question = await createNoraQuestion(
      db,
      dummyQuestion.question_title,
      dummyQuestion.answers,
      dummyQuestion.current_answer_index,
      dummyQuestion.score
    );

    const newTitle = 'netai';
    const newAns = ['uooooooooooooooo'];
    const newAnsI = 0;
    const newScore = 1000;

    await testApiHandler({
      handler: put,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.sessionCookie,
          'content-type': 'application/json',
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'PUT',
          body: JSON.stringify({
            id: question.id,
            question_title: newTitle,
            answers: newAns,
            current_answer_index: newAnsI,
            score: newScore,
          }),
        });
        expect(res.status).toBe(200);

        const q = await findNoraQuestionById(db, question.id);

        const _q = new NoraQuestion({
          id: question.id,
          question_title: newTitle,
          answers: [
            {
              index: 0,
              answerText: newAns[0],
            },
          ],
          current_answer_index: newAnsI,
          score: newScore,
        });

        expect(q).toEqual(_q);
      },
    });
  });

  test('putで管理者以外は403', async () => {
    await testApiHandler({
      handler: put,
      requestPatcher: async req => {
        req.headers = {
          cookie: normalUser.sessionCookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(403);
      },
    });
  });

  test('putで指定しないカラムは変更しない', async () => {
    expect.hasAssertions();

    const question = await createNoraQuestion(
      db,
      dummyQuestion.question_title,
      dummyQuestion.answers,
      dummyQuestion.current_answer_index,
      dummyQuestion.score
    );

    const newAns = ['uooooooooooooooo'];
    const newAnsI = 0;
    const newScore = 1000;

    await testApiHandler({
      handler: put,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.sessionCookie,
          'content-type': 'application/json',
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'PUT',
          body: JSON.stringify({
            id: question.id,
            answers: newAns,
            current_answer_index: newAnsI,
            score: newScore,
          }),
        });
        expect(res.status).toBe(200);

        const q = await findNoraQuestionById(db, question.id);

        const _q = new NoraQuestion({
          id: question.id,
          question_title: dummyQuestion.question_title,
          answers: [
            {
              index: 0,
              answerText: newAns[0],
            },
          ],
          current_answer_index: newAnsI,
          score: newScore,
        });

        expect(q).toEqual(_q);
      },
    });
  });

  test('delete', async () => {
    expect.hasAssertions();

    const question = await createNoraQuestion(
      db,
      dummyQuestion.question_title,
      dummyQuestion.answers,
      dummyQuestion.current_answer_index,
      dummyQuestion.score
    );

    await testApiHandler({
      handler: _delete,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.sessionCookie,
        };
      },
      url: `/?id=${question.id}`,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'DELETE',
        });
        expect(res.status).toBe(200);

        const q = await findNoraQuestionById(db, question.id);

        expect(q).toBeNull();
      },
    });
  });

  test('deleteで管理者以外は403', async () => {
    await testApiHandler({
      handler: _delete,
      requestPatcher: async req => {
        req.headers = {
          cookie: normalUser.sessionCookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(403);
      },
    });
  });

  test('deleteで存在しないIDでも200', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: _delete,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.sessionCookie,
        };
      },
      url: `/?id=${randomInt(1000)}`,
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'DELETE',
        });
        expect(res.status).toBe(200);
      },
    });
  });
});
