console.log('Try npm run lint/fix!');

const longString =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut aliquet diam.';

const trailing = 'Semicolon';

const why = 'am I tabbed?';

/**
 *
 * do something
 *
 * @param {string} withThis - whis this
 * @param {string} andThat - and that
 * @param {string[]} andThose - and those
 * @returns {boolean} - hoge
 */
export function doSomeStuff(
  withThis: string,
  andThat: string,
  andThose: string[]
) {
  //function on one line
  if (!andThose.length) {
    return false;
  }
  console.log(withThis);
  console.log(andThat);
  console.dir(andThose);
  return;
}
// TODO: more examples

/**
 *
 * @param {number} a - number
 * @returns {string} - str
 */
export function testA(a: number): string {
  if (a === 0) {
    return 'hoge';
  }

  return 'huga';
}

/**
 *
 * @param {number} i - 数字
 */
export const sample = (i: number): number => Math.pow(i, 2);
