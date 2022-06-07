import {randomBytes} from 'crypto';
import mysql from 'mysql2/promise';
import config from '../../config';
import {findCertByUserID, setCert} from '../../src/services/cert';
import {createCertModel} from '../../src/tests/models';

describe('setCert', () => {
  let connection: mysql.Connection;

  beforeAll(async () => {
    connection = await mysql.createConnection(config.db);
    await connection.connect();
  });

  afterAll(async () => {
    await connection.end();
  });

  test('ssoだけ', async () => {
    const ssoId = randomBytes(32).toString('hex');

    const certModel = createCertModel({cateiru_sso_id: ssoId});

    await setCert(connection, certModel);

    const cert = await findCertByUserID(connection, certModel.user_id);

    expect(cert.user_id).toBe(certModel.user_id);
    expect(cert.cateiru_sso_id).toBe(ssoId);
    expect(cert.password).toBe(null);
  });

  test('passwordだけ', async () => {
    const pw = randomBytes(32).toString('hex');

    const certModel = createCertModel({password: pw});

    await setCert(connection, certModel);

    const cert = await findCertByUserID(connection, certModel.user_id);

    expect(cert.user_id).toBe(certModel.user_id);
    expect(cert.cateiru_sso_id).toBe(null);
    expect(cert.password).toBe(pw);
  });

  test('ssoとpassword', async () => {
    const pw = randomBytes(32).toString('hex');
    const ssoId = randomBytes(32).toString('hex');

    const certModel = createCertModel({password: pw, cateiru_sso_id: ssoId});

    await setCert(connection, certModel);

    const cert = await findCertByUserID(connection, certModel.user_id);

    expect(cert.user_id).toBe(certModel.user_id);
    expect(cert.cateiru_sso_id).toBe(ssoId);
    expect(cert.password).toBe(pw);
  });
});
