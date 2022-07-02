import LoginHistory from '../../src/models/loginHistory';
import {createLoginHistoryModel} from '../../src/tests/models';

describe('loginHistory', () => {
  test('作成できる', () => {
    const loginHistory = createLoginHistoryModel();

    const l = new LoginHistory(loginHistory);

    expect(l.user_id).toBe(loginHistory.user_id);

    expect(l.login_date).toEqual(loginHistory.login_date);
    expect(l.device_name).toBe(loginHistory.device_name);
  });
});
