import {RowDataPacket} from 'mysql2/promise';
import {testApiHandler} from 'next-test-api-route-handler';
import {findSessionTokenByRefreshToken} from '../../src/services/session';
import TestBase from '../../src/tests/base';
import deleteUserHandler from '../../src/user/delete';

describe('アカウント削除', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('削除できる', async () => {
    expect.hasAssertions();

    const user = await base.newUser();
    await user.loginFromPassword(base.db);
    await user.addSession(base.db);

    const userRows = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM user WHERE id = ?',
      user.user?.id
    );

    expect(userRows.length).toBe(1);

    const certRows = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM cert WHERE user_id = ?',
      user.user?.id
    );

    expect(certRows.length).toBe(1);

    const session = await findSessionTokenByRefreshToken(
      base.db,
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

        const userRows = await base.db.test<RowDataPacket[]>(
          'SELECT * FROM user WHERE id = ?',
          user.user?.id
        );

        expect(userRows.length).toBe(0);

        const certRows = await base.db.test<RowDataPacket[]>(
          'SELECT * FROM cert WHERE user_id = ?',
          user.user?.id
        );

        expect(certRows.length).toBe(0);

        const session = await findSessionTokenByRefreshToken(
          base.db,
          user.session?.refresh_token || ''
        );

        expect(session).toBeNull();
      },
    });
  });
});
