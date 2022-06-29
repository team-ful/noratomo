import mysql, {RowDataPacket} from 'mysql2/promise';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../config';
import {findSessionTokenByRefreshToken} from '../../src/services/session';
import {TestUser} from '../../src/tests/user';
import deleteUserHandler from '../../src/user/delete';

describe('アカウント削除', () => {
  let db: mysql.Connection;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('削除できる', async () => {
    expect.hasAssertions();

    const user = new TestUser();

    await user.create(db);
    await user.loginFromPassword(db);
    await user.addSession(db);

    const [userRows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM user WHERE id = ?',
      user.user?.id
    );

    expect(userRows.length).toBe(1);

    const [certRows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM cert WHERE user_id = ?',
      user.user?.id
    );

    expect(certRows.length).toBe(1);

    const session = await findSessionTokenByRefreshToken(
      db,
      user.session?.refresh_token || ''
    );

    expect(session).not.toBeNull();

    await testApiHandler({
      handler: deleteUserHandler,
      requestPatcher: async req => {
        req.headers = {
          cookie: user.cookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({method: 'DELETE'});

        expect(res.status).toBe(200);

        const [userRows] = await db.query<RowDataPacket[]>(
          'SELECT * FROM user WHERE id = ?',
          user.user?.id
        );

        expect(userRows.length).toBe(0);

        const [certRows] = await db.query<RowDataPacket[]>(
          'SELECT * FROM cert WHERE user_id = ?',
          user.user?.id
        );

        expect(certRows.length).toBe(0);

        const session = await findSessionTokenByRefreshToken(
          db,
          user.session?.refresh_token || ''
        );

        expect(session).toBeNull();
      },
    });
  });
});
