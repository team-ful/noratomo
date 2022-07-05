import {RowDataPacket} from 'mysql2/promise';
import {
  deleteCertById,
  findCertByUserID,
  setCert,
} from '../../src/services/cert';
import TestBase from '../../src/tests/base';
import {createCertModel} from '../../src/tests/models';
import {randomText} from '../../src/utils/random';

describe('setCert', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('ssoだけ', async () => {
    const ssoId = randomText(32);

    const certModel = createCertModel({cateiru_sso_id: ssoId});

    await setCert(base.db, certModel);

    const cert = await findCertByUserID(base.db, certModel.user_id);

    expect(cert.user_id).toBe(certModel.user_id);
    expect(cert.cateiru_sso_id).toBe(ssoId);
    expect(cert.password).toBe(null);
  });

  test('passwordだけ', async () => {
    const pw = randomText(32);

    const certModel = createCertModel({password: pw});

    await setCert(base.db, certModel);

    const cert = await findCertByUserID(base.db, certModel.user_id);

    expect(cert.user_id).toBe(certModel.user_id);
    expect(cert.cateiru_sso_id).toBe(null);
    expect(cert.password).toBe(pw);
  });

  test('ssoとpassword', async () => {
    const pw = randomText(32);
    const ssoId = randomText(32);

    const certModel = createCertModel({password: pw, cateiru_sso_id: ssoId});

    await setCert(base.db, certModel);

    const cert = await findCertByUserID(base.db, certModel.user_id);

    expect(cert.user_id).toBe(certModel.user_id);
    expect(cert.cateiru_sso_id).toBe(ssoId);
    expect(cert.password).toBe(pw);
  });

  test('certを削除する', async () => {
    const pw = randomText(32);

    const certModel = createCertModel({password: pw});

    await setCert(base.db, certModel);

    let rows = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM cert WHERE user_id = ?',
      certModel.user_id
    );

    expect(rows.length).toBe(1);

    await deleteCertById(base.db, certModel.user_id);

    rows = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM cert WHERE user_id = ?',
      certModel.user_id
    );

    expect(rows.length).toBe(0);
  });
});
