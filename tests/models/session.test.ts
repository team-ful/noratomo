import {randomBytes, randomInt} from 'crypto';
import {Session} from '../../src/models/session';

describe('isPeriod', () => {
  const now = new Date(Date.now());

  const onHourDate = new Date(Date.now());
  onHourDate.setHours(onHourDate.getHours() + 1);

  const onDayAgoDate = new Date(Date.now());
  onDayAgoDate.setDate(onDayAgoDate.getDate() - 1);

  test('有効期限内の場合はfalse', () => {
    const session = new Session({
      session_token: randomBytes(32).toString('hex'),
      date: now,
      period_date: onHourDate,
      user_id: randomInt(10),
    });

    expect(session.isPeriod()).toBeFalsy();
  });

  test('有効期限切れの場合はtrue', () => {
    const session = new Session({
      session_token: randomBytes(32).toString('hex'),
      date: now,
      period_date: onDayAgoDate,
      user_id: randomInt(10),
    });

    expect(session.isPeriod()).toBeTruthy();
  });
});
