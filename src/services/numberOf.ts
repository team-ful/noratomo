import sql from 'mysql-bricks';
import DBOperator from '../db/operator';
import {NumberOf} from '../models/numberOf';

/**
 * 統計を作成する。
 * - カラムがすでに存在する場合
 * そのカラムに引数の値を足す
 * - カラムは存在しない場合
 * 新しくカラムを作成する
 *
 * @param {DBOperator} db - database
 * @param {number} userId - user id
 * @param {number} evaluations - evaluations の個数
 * @param {number} entry - entryの個数
 * @param {number} meet - meet の個数
 * @param {number} application - applicationの個数
 */
export async function insertNumberOf(
  db: DBOperator,
  userId: number,
  evaluations?: number,
  entry?: number,
  meet?: number,
  application?: number
) {
  const update: {[key: string]: unknown}[] = [];
  const insert: {[key: string]: number} = {user_id: userId};

  // placeholder = ? として出力しているが、
  // mysql-bricksのメソッドを通すとデフォルトの`$`しか通用しなくなってしまうようなので
  // 仕方なく$を使用している

  if (typeof evaluations !== 'undefined') {
    update.push({evaluations: sql('evaluations + $', evaluations)});
    insert['evaluations'] = evaluations;
  }
  if (typeof entry !== 'undefined') {
    update.push({entry: sql('entry + $', entry)});
    insert['entry'] = entry;
  }
  if (typeof meet !== 'undefined') {
    update.push({meet: sql('meet + $', meet)});
    insert['meet'] = meet;
  }
  if (typeof application !== 'undefined') {
    update.push({application: sql('application + $', application)});
    insert['application'] = application;
  }

  const query = sql
    .insertInto('number_of', insert)
    .onDuplicateKeyUpdate(update)
    .toParams({placeholder: '?'});

  await db.insert(query);
}

/**
 * 主にデクリメントする際に使用する
 *
 * @param {DBOperator} db - database
 * @param {number} userId - user id
 * @param {number} evaluations - evaluations の個数
 * @param {number} entry - entryの個数
 * @param {number} meet - meet の個数
 * @param {number} application - applicationの個数
 */
export async function updateNumberOf(
  db: DBOperator,
  userId: number,
  evaluations?: number,
  entry?: number,
  meet?: number,
  application?: number
) {
  const update: {[key: string]: unknown} = {};

  insertUpdateColumns(update, 'evaluations', evaluations);
  insertUpdateColumns(update, 'entry', entry);
  insertUpdateColumns(update, 'meet', meet);
  insertUpdateColumns(update, 'application', application);

  const query = sql
    .update('number_of', update)
    .where('user_id', userId)
    .toParams({placeholder: '?'});

  console.log(query);

  await db.execute(query);
}

/**
 * Updateするカラムを突っ込む
 *
 * @param {object} values - updateするカラム
 * @param {string} columnName - カラム名
 * @param {number | undefined} target - target
 */
function insertUpdateColumns(
  values: {[key: string]: unknown},
  columnName: string,
  target?: number
) {
  if (typeof target !== 'undefined') {
    if (target > 0) {
      values[columnName] = sql(`${columnName} + ?`, target);
    } else {
      values[columnName] = sql(`${columnName} - ?`, -target);
    }
  }
}

/**
 * user id から統計を引く
 *
 * @param {DBOperator} db - database
 * @param {number} userId - user id
 */
export async function findNumberOfByUserId(
  db: DBOperator,
  userId: number
): Promise<NumberOf | null> {
  const query = sql
    .select('*')
    .from('number_of')
    .where('user_id', userId)
    .toParams({placeholder: '?'});

  const row = await db.one(query);

  if (row === null) {
    return null;
  }

  return new NumberOf(row);
}
