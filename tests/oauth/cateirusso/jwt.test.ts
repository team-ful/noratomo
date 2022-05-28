import fetchMock from 'fetch-mock-jest';
import config from '../../../config';
import {
  JWT,
  JWTPublicKey,
  TokenResponse,
} from '../../../src/oauth/cateirusso/jwt';

// https://jwt.io/ より
const JWTCode =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ';

// https://jwt.io/ より
const PublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1SU1LfVLPHCozMxH2Mo
4lgOEePzNm0tRgeLezV6ffAt0gunVTLw7onLRnrq0/IzW7yWR7QkrmBL7jTKEn5u
+qKhbwKfBstIs+bMY2Zkp18gnTxKLxoS2tFczGkPLPgizskuemMghRniWaoLcyeh
kd3qqGElvW/VDL5AaWTg0nLVkjRo9z+40RQzuVaE8AkAFmxZzow3x+VJYKdjykkJ
0iT9wCS0DRTXu269V264Vf/3jvredZiKRkgwlL9xNAwxXFg0x/XFw005UWVRIkdg
cKWTjpBP2dPwVZ4WWC+9aGVd+Gyn1o0CLelf4rEjGoXbAAEgAqeGUxrcIlbjXfbc
mwIDAQAB
-----END PUBLIC KEY-----
`;

const code = '123456';

describe('jwt', () => {
  const redirect = config.host;
  redirect.pathname = '/api/oauth/login/cateirusso';

  const url = config.cateiruSSOTokenEndpoint;
  url.searchParams.set('grant_type', 'authorization_code');
  url.searchParams.set('code', code);
  url.searchParams.set('redirect_uri', redirect.toString());

  test('parse', async () => {
    fetchMock
      .get(url.toString(), {
        access_token: code,
        token_type: 'id_token',
        refresh_token: 'refresh',
        expires_in: '3600',
        id_token: JWTCode,
      } as TokenResponse)
      .mock(config.cateiruSSOPublicKeyEndpoint.toString(), {
        pkcs8: PublicKey,
      } as JWTPublicKey);
    const j = new JWT(code);

    const idToken = await j.parse();

    expect(idToken['sub']).toBe('1234567890');
    expect(idToken['name']).toBe('John Doe');
    expect(idToken['admin']).toBe(true);
    expect(idToken['iat']).toBe(1516239022);
  });
});
