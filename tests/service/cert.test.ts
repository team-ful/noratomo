import mysql, {RowDataPacket} from 'mysql2/promise';
import config from '../../config';
import {
  deleteCertById,
  findCertByUserID,
  setCert,
} from '../../src/services/cert';
import {createCertModel} from '../../src/tests/models';
import {randomText} from '../../src/utils/random';

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
    const ssoId = randomText(32);

    const certModel = createCertModel({cateiru_sso_id: ssoId});

    await setCert(connection, certModel);

    const cert = await findCertByUserID(connection, certModel.user_id);

    expect(cert.user_id).toBe(certModel.user_id);
    expect(cert.cateiru_sso_id).toBe(ssoId);
    expect(cert.password).toBe(null);
  });

  test('passwordだけ', async () => {
    const pw = randomText(32);

    const certModel = createCertModel({password: pw});

    await setCert(connection, certModel);

    const cert = await findCertByUserID(connection, certModel.user_id);

    expect(cert.user_id).toBe(certModel.user_id);
    expect(cert.cateiru_sso_id).toBe(null);
    expect(cert.password).toBe(pw);
  });

  test('ssoとpassword', async () => {
    const pw = randomText(32);
    const ssoId = randomText(32);

    const certModel = createCertModel({password: pw, cateiru_sso_id: ssoId});

    await setCert(connection, certModel);

    const cert = await findCertByUserID(connection, certModel.user_id);

    expect(cert.user_id).toBe(certModel.user_id);
    expect(cert.cateiru_sso_id).toBe(ssoId);
    expect(cert.password).toBe(pw);
  });

  test('certを削除する', async () => {
    const pw = randomText(32);

    const certModel = createCertModel({password: pw});

    await setCert(connection, certModel);

    let [rows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM cert WHERE user_id = ?',
      certModel.user_id
    );

    expect(rows.length).toBe(1);

    await deleteCertById(connection, certModel.user_id);

    [rows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM cert WHERE user_id = ?',
      certModel.user_id
    );

    expect(rows.length).toBe(0);
  });
});
