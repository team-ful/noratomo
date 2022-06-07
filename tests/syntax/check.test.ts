import {randomBytes} from 'crypto';
import {
  checkAge,
  checkMail,
  checkPW,
  checkUserName,
} from '../../src/syntax/check';

describe('checkUserName', () => {
  test('正しい', () => {
    const names = ['abcd', 'ab_', 'cateiru', 'nya-n'];

    for (const n of names) {
      expect(() => checkUserName(n)).not.toThrow();
    }
  });

  test('3文字より小さいとエラー', () => {
    const name = 'aa';

    expect(() => checkUserName(name)).toThrow();
  });

  test('16文字より大きいとエラー', () => {
    const name = randomBytes(32).toString('hex');

    expect(() => checkUserName(name)).toThrow();
  });

  test('形式が対応していないとエラー', () => {
    const names = ['test@example.com', 'aaaaa@@@a:sd'];

    for (const n of names) {
      expect(() => checkUserName(n)).toThrow();
    }
  });
});

describe('checkMail', () => {
  test('正しい', () => {
    const mails = ['test@example.com', 'info@cateiru.dev'];

    for (const m of mails) {
      expect(() => checkMail(m)).not.toThrow();
    }
  });

  test('正しくない', () => {
    const mails = ['nyaaaa', 'hogehoge@aaaaaa'];

    for (const m of mails) {
      expect(() => checkMail(m)).toThrow();
    }
  });
});

describe('checkAge', () => {
  test('正しい', () => {
    const age = [0, 1, 10, 23, 54, 100, 120];

    for (const a of age) {
      expect(() => checkAge(a)).not.toThrow();
    }
  });

  test('正しくない', () => {
    const age = [-1, 1000];

    for (const a of age) {
      expect(() => checkAge(a)).toThrow();
    }
  });
});

describe('checkPW', () => {
  test('正しい', () => {
    const pw = randomBytes(64).toString('hex');

    expect(() => checkPW(pw)).not.toThrow();
  });

  test('10文字より小さいとエラー', () => {
    const pw = 'hogehoge';

    expect(() => checkPW(pw)).not.toThrow();
  });
});
