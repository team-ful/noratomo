import {RowDataPacket} from 'mysql2';
import {
  createNoraSession,
  findNoraSessionByToken,
} from '../../src/services/noraSession';
import TestBase from '../../src/tests/base';
import {randomText} from '../../src/utils/random';

describe('noraSession', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('findNoraSessionByToken', async () => {
    const token = randomText(64);
    await base.db.test(
      `INSERT INTO nora_session (
      token,
      question_ids
    ) VALUES (?, ?)`,
      [token, '1,2']
    );

    const session = await findNoraSessionByToken(base.db, token);

    expect(session?.token).toBe(token);
    expect(session?.question_ids).toBe('1,2');
  });

  test('createNoraSession', async () => {
    const ids = [1, 2];

    const token = await createNoraSession(base.db, ids);

    const [session] = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM nora_session WHERE token = ?',
      [token]
    );

    expect(session.token).toBe(token);
    expect(session.question_ids).toBe('1,2');
  });
});
