import sql from 'mysql-bricks';
import {testApiHandler} from 'next-test-api-route-handler';
import login_historyHandler from '../../../../pages/api/user/login_history';
import {findLoginHistoriesByUserID} from '../../../../src/services/loginHistory';
import TestBase from '../../../../src/tests/base';
import {createLoginHistoryModel} from '../../../../src/tests/models';

describe('login_history', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();

    const u = await base.newUser();
    await u.loginFromPassword(base.db);
    await u.addSession(base.db);

    const d = createLoginHistoryModel({user_id: u.user?.id});
    const values = [];
    for (let i = 0; 50 > i; i++) {
      values.push([
        d.user_id,
        sql('INET_ATON(?)', d.ip_address),
        d.device_name,
        d.os,
        sql('DATE_ADD(NOW(), INTERVAL ? HOUR)', i),
      ]);
    }
    const query = sql
      .insertInto(
        'login_history',
        'user_id',
        'ip_address',
        'device_name',
        'os',
        'login_date'
      )
      .values(values)
      .toParams({placeholder: '?'});
    await base.db.execute(query);
  });

  afterAll(async () => {
    await base.end();
  });

  test('limitなしでdbからデータを取得できている', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: login_historyHandler,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);
        if (res.status && base.users[0].user?.id) {
          const findedLoginHistory = await findLoginHistoriesByUserID(
            base.db,
            base.users[0].user?.id
          );
          const d = findedLoginHistory.map(x => x.json());
          const dJson = JSON.stringify(d);
          /*res.json()ではapiから受け取ったJsonデータをparseする。
          JsonはDateの区別をしないので、日付が違う形式に変換された上でStringとして処理される。
          そのため、用意したデータはただDBから持ってくるだけだと、Jsonへの変換とパースがされていない
          ため、期待するデータに合わせるために、stringify(),parse()を行っている。
          */
          expect(await res.json()).toStrictEqual(JSON.parse(dJson));
        } else {
          throw new Error('レスポンスまたはユーザの取得に失敗');
        }
      },
    });
  });
  test('limitありでdbからデータを取得できている', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: login_historyHandler,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
        };
        req.url = '?limit=10';
      },
      test: async ({fetch}) => {
        const res = await fetch();

        expect(res.status).toBe(200);
        if (res.status && base.users[0].user?.id) {
          //上のクエリでlimitを0で指定した場合は、handolerで50個として認識される
          //なので、ここでは50のlimit指定する。
          const findedLoginHistory = await findLoginHistoriesByUserID(
            base.db,
            base.users[0].user?.id,
            10
          );
          const d = findedLoginHistory.map(x => x.json());
          const dJson = JSON.stringify(d);
          /*res.json()ではapiから受け取ったJsonデータをparseする。
          JsonはDateの区別をしないので、日付が違う形式(ISO 8601)に変換された上でStringとして処理される。
          そのため、用意したデータはただDBから持ってくるだけだと、Jsonへの変換とパースがされていない
          ため、期待するデータに合わせるために、stringify(),parse()を行っている。
          */
          expect(await res.json()).toEqual(JSON.parse(dJson));
        } else {
          throw new Error('レスポンスまたはユーザの取得に失敗');
        }
      },
    });
  });
  test('異常なlimitでは履歴を取得できない', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: login_historyHandler,
      requestPatcher: async req => {
        req.headers = {
          cookie: base.users[0].sessionCookie,
        };
        req.url = '?limit=0';
      },
      test: async ({fetch}) => {
        const res = await fetch();
        expect(res.status).toBe(400);
      },
    });
  });
});
