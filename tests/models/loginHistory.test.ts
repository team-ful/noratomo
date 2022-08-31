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

  test('ログイン履歴のユーザー情報部分を返す', () => {
    const loginHistory = createLoginHistoryModel();
    const l = new LoginHistory(loginHistory);

    expect(l.json()).toEqual({
      id: loginHistory.id,
      ip_address: loginHistory.ip_address,
      device_name: loginHistory.device_name,
      os: loginHistory.os,
      is_phone: loginHistory.is_phone,
      is_desktop: loginHistory.is_desktop,
      is_tablet: loginHistory.is_tablet,
      browser_name: loginHistory.browser_name,
      login_date: loginHistory.login_date,
    });
  });
});
