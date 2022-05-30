import {randomInt} from 'crypto';
import {CertModel} from '../models/cret';

/**
 * ダミーのCertオブジェクトを作成する
 *
 * @param {Partial<CertModel>} options - オプション
 * @returns {CertModel} cert
 */
export const createCertModel = (options?: Partial<CertModel>): CertModel => ({
  user_id: options?.user_id || randomInt(32),
  cateiru_sso_id: options?.cateiru_sso_id || null,
  password: options?.password || null,
});
