import sql from 'mysql-bricks';
import {
  Connection,
  RowDataPacket,
  OkPacket,
  ResultSetHeader,
} from 'mysql2/promise';

export type QueryPacket =
  | RowDataPacket[]
  | RowDataPacket[][]
  | OkPacket
  | OkPacket[]
  | ResultSetHeader;

export interface DefaultObject {
  [key: string]: string | Date | number | boolean | null | object;
}

export default class DBOperator {
  private db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }

  /**
   * DBクエリを実行する
   *
   * @param {sql.SqlBricksParam} query - クエリ
   * @returns {QueryPacket} - クエリ
   */
  public async runQuery<T extends QueryPacket>(
    query: sql.SqlBricksParam
  ): Promise<T> {
    const [rows] = await this.db.query<T>(query.text, query.values);

    return rows;
  }

  /**
   * DBから要素を1つ取得する
   *
   * @param {sql.SqlBricksParam} query - クエリ
   * @returns {null | object}  要素が無い場合はnull
   */
  public async one<T extends Object = DefaultObject>(
    query: sql.SqlBricksParam
  ): Promise<null | T> {
    const row = await this.runQuery<RowDataPacket[]>(query);

    if (row.length === 0) {
      return null;
    }

    return row[0] as T;
  }

  /**
   * DBから複数の要素を取得する
   *
   * @param {sql.SqlBricksParam} query - クエリ
   * @returns {null | object}  要素が無い場合はnull
   */
  public async multi<T extends Object = DefaultObject>(
    query: sql.SqlBricksParam
  ): Promise<T[]> {
    const row = await this.runQuery<RowDataPacket[]>(query);

    return row as T[];
  }

  /**
   * insertをして、insertIdを返します
   *
   * @param {sql.SqlBricksParam} query - クエリ
   * @returns {number}  insert id
   */
  public async insert(query: sql.SqlBricksParam): Promise<number> {
    const row = await this.runQuery<ResultSetHeader>(query);

    return row.insertId;
  }

  /**
   * ただ単に実行する
   *
   * @param {sql.SqlBricksParam} query - クエリ
   */
  public async execute(query: sql.SqlBricksParam): Promise<void> {
    await this.runQuery(query);
  }

  /**
   * テスト用
   *
   * @param {string} text - query text
   * @param {any} values - value
   * @returns {QueryPacket} - result
   */
  public async test<T extends QueryPacket>(
    text: string,
    values: any
  ): Promise<T> {
    return this.runQuery<T>({text: text, values: values});
  }

  /**
   * DBを終了する
   *
   */
  public async end() {
    await this.db.end();
  }
}
