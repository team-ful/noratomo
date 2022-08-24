import {NumberOf} from '../../src/models/numberOf';

describe('numberOf', () => {
  test('作成できる', () => {
    const numberOf = new NumberOf({
      user_id: 123,
      evaluations: 12,
      meet: 1,
      application: 0,
    });

    expect(numberOf.user_id).toBe(123);
    expect(numberOf.evaluations).toBe(12);
    expect(numberOf.meet).toBe(1);
    expect(numberOf.application).toBe(0);
  });
});
