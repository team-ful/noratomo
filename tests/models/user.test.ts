import User, {UserModel} from '../../src/models/user';
import {createJoinDate, createUserModel} from '../../src/tests/user';

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
    const joinDate = createJoinDate(new Date(Date.now() - 1000));
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
