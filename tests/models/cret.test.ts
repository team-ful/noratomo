import argon2 from 'argon2';
import Cert from '../../src/models/cret';
import {randomText} from '../../src/utils/random';

describe('cert', () => {
  test('equalCateiruSSO', () => {
    const id1 = randomText(32);
    const id2 = randomText(32);

    const cert1 = new Cert({
      user_id: 1,
      password: null,
      cateiru_sso_id: id1,
    });

    expect(cert1.equalCateiruSSO(id2)).toBeFalsy();
    expect(cert1.equalCateiruSSO(id1)).toBeTruthy();
  });

  test('equalPassword', async () => {
    const pw1 = randomText(32);
    const pw2 = randomText(32);

    const cert1 = new Cert({
      user_id: 1,
      password: await argon2.hash(pw1),
      cateiru_sso_id: null,
    });

    expect(await cert1.equalPassword(pw2)).toBeFalsy();
    expect(await cert1.equalPassword(pw1)).toBeTruthy();
  });
});
