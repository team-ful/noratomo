import {randomBytes} from 'crypto';
import mysql from 'mysql2/promise';
import config from '../../config';
import {findCertByUserID, setCert} from '../../src/services/cert';
import {createCertModel} from '../../src/tests/models';

describe('cert', () => {
  let connection: mysql.Connection;

  beforeAll(async () => {
    connection = await mysql.createConnection(config.db);
    await connection.connect();
  });

  afterAll(async () => {
    await connection.end();
  });

  test('setCert', async () => {
    const ssoId = randomBytes(32).toString('hex');

    const certModel = createCertModel({cateiru_sso_id: ssoId});

    await setCert(connection, certModel);

    const cert = await findCertByUserID(connection, certModel.user_id);

    expect(cert.user_id).toBe(certModel.user_id);
    expect(cert.cateiru_sso_id).toBe(ssoId);
    expect(cert.password).toBe(null);
  });
});
