import {
  checkAge,
  checkDisplayName,
  checkMail,
  checkPW,
  checkUserName,
  checkProfile,
} from '../../src/syntax/check';
import {randomText} from '../../src/utils/random';

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
    const name = randomText(32);

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
    const pw = randomText(32);

    expect(() => checkPW(pw)).not.toThrow();
  });

  test('10文字より小さいとエラー', () => {
    const pw = 'hogehoge';

    expect(() => checkPW(pw)).toThrow();
  });
});

describe('checkDisplayName', () => {
  test('正しい', () => {
    const names = ['hogehoge', 'asdlwp0-sdf', 'asdp34dps3', 'asdg_asd3', 'a'];

    for (const n of names) {
      expect(() => checkDisplayName(n)).not.toThrow();
    }
  });

  test('フォーマットが正しくないとエラー', () => {
    const names = ['@@@asogo4p', '', randomText(64)];

    for (const n of names) {
      expect(() => checkDisplayName(n)).toThrow();
    }
  });
});

describe('checkProfile', () => {
  test('正しい', () => {
    const p = ['a', randomText(32)];

    for (const n of p) {
      expect(() => checkProfile(n)).not.toThrow();
    }
  });

  test('128文字制限', () => {
    const p = randomText(128);

    expect(() => checkProfile(p)).toThrow();
  });
});
