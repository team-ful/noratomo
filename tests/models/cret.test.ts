import {randomBytes} from 'crypto';
import argon2 from 'argon2';
import Cert from '../../src/models/cret';

describe('cert', () => {
  test('equalCateiruSSO', () => {
    const id1 = randomBytes(32).toString('hex');
    const id2 = randomBytes(32).toString('hex');

    const cert1 = new Cert({
      user_id: 1,
      password: null,
      cateiru_sso_id: id1,
    });

    expect(cert1.equalCateiruSSO(id2)).toBeFalsy();
    expect(cert1.equalCateiruSSO(id1)).toBeTruthy();
  });

  test('equalPassword', async () => {
    const pw1 = randomBytes(32).toString('hex');
    const pw2 = randomBytes(32).toString('hex');

    const cert1 = new Cert({
      user_id: 1,
      password: await argon2.hash(pw1),
      cateiru_sso_id: null,
    });

    expect(await cert1.equalPassword(pw2)).toBeFalsy();
    expect(await cert1.equalPassword(pw1)).toBeTruthy();
  });
});
