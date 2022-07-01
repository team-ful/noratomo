import {randomBytes} from 'crypto';

/**
 * ランダムな文字列を生成する
 *
 * @param {number} size - 文字数
 * @returns {string} - ランダム文字列
 */
export const randomText = (size: number): string =>
  randomBytes(size).reduce((p, i) => p + (i % 36).toString(36), '');
