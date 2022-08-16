import User, {UserModel} from '../../src/models/user';
import TestBase from '../../src/tests/base';
import {
  createNoticeModel,
  createUserModel,
  dbDate,
} from '../../src/tests/models';

describe('is', () => {
  let user1: UserModel;
  let user2: UserModel;
  let user3: UserModel;

  beforeAll(() => {
    user1 = createUserModel();
    user2 = createUserModel();

    user3 = createUserModel({id: user1.id}); // user1とuser2のidは同じ = 同じユーザであるはず
  });

  test('同じユーザだとisでtrueが返る', () => {
    const first = new User(user1);
    const second = new User(user3);

    expect(first.id).toBe(second.id);
    expect(first.is(second)).toBe(true);
  });

  test('違うユーザの場合はfalseが返る', () => {
    const first = new User(user1);
    const second = new User(user2);

    expect(first.is(second)).toBe(false);
  });
});

describe('isSeniority', () => {
  let user1: UserModel;
  let user2: UserModel;
  let user3: UserModel;

  beforeAll(() => {
    user1 = createUserModel();

    // 現在時刻より1000s早い時間にする
    const joinDate = dbDate(new Date(Date.now() - 1000));
    user2 = createUserModel({join_date: joinDate});

    user3 = createUserModel({join_date: user1.join_date});
  });

  test('比較するユーザよりが自分より早く参加している', () => {
    const first = new User(user1);
    const second = new User(user2);

    expect(first.isSeniority(second)).toBe(false);
  });

  test('比較するユーザより自分のほうが早く参加している', () => {
    const first = new User(user2);
    const second = new User(user1);

    expect(first.isSeniority(second)).toBe(true);
  });

  test('参加日時が同じ場合はfalseが返る', () => {
    const first = new User(user1);
    const second = new User(user3);

    expect(first.isSeniority(second)).toBe(false);
    expect(second.isSeniority(first)).toBe(false);
  });
});

describe('notice', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();

    const user = await base.newUser();

    const noticeModel = createNoticeModel({
      is_read: true,
      user_id: user.user?.id,
    });

    for (let i = 0; 2 > i; i++) {
      await base.db.test(
        'INSERT INTO notice (user_id, title, is_read, created) VALUES (?, ?, ?, NOW())',
        [noticeModel.user_id, noticeModel.title, noticeModel.is_read]
      );
    }
    await base.db.test(
      'INSERT INTO notice (user_id, title, is_read, created) VALUES (?, ?, ?, NOW())',
      [noticeModel.user_id, noticeModel.title, false]
    );
  });

  afterAll(async () => {
    await base.end();
  });

  test('get all', async () => {
    const user = base.users[0].user;

    const notices = await user?.notice(base.db, true);
    expect(notices?.length).toBe(3);

    const noticesLimit = await user?.notice(base.db, true, 2);
    expect(noticesLimit?.length).toBe(2);
  });

  test('get no read', async () => {
    const user = base.users[0].user;

    const notices = await user?.notice(base.db, false);
    expect(notices?.length).toBe(1);
  });
});
