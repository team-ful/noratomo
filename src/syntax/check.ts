import {ApiError} from 'next/dist/server/api-utils';

/**
 * ユーザ名が正しいかチェックする
 * 3 < x <= 16
 *
 * @param {string} userName - ユーザ名
 */
export function checkUserName(userName: string) {
  const userNameLen = userName.length;
  if (userNameLen < 3 || userNameLen > 16) {
    throw new ApiError(400, 'user name is 3 <= x <= 16');
  }

  if (!/^[0-9a-zA-Z_-]+$/.test(userName)) {
    throw new ApiError(400, 'not user name format');
  }
}

/**
 * メールアドレスが正しいかどうかチェックする
 *
 * @param {string} mail - メールアドレス
 */
export function checkMail(mail: string) {
  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(
      mail
    )
  ) {
    throw new ApiError(400, 'not email format');
  }
}

/**
 * 年齢が正しいかチェックする
 *
 * @param {number} age - 年齢
 */
export function checkAge(age: number) {
  // 年齢は0以下はありえない
  // また、2022年現在150歳の人間はいない
  if (age < 0 || age >= 150) {
    throw new ApiError(400, 'not age format');
  }
}

/**
 * パスワードをチェックする
 * パスワードは10文字異常127文字以下
 *
 * @param {string} password - パスワード
 */
export function checkPW(password: string) {
  const passwordLen = password.length;
  if (passwordLen >= 10 && passwordLen < 128) {
    throw new ApiError(400, 'password is 10 <= x < 128');
  }
}
