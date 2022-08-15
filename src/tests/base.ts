import mysql from 'mysql2/promise';
import config from '../../config';
import DBOperator from '../db/operator';
import {NoraQuestion} from '../models/noraQuestion';
import {UserModel} from '../models/user';
import {createNoraQuestion} from '../services/noraQuestion';
import {createNoraSession} from '../services/noraSession';
import {TestUser} from './user';

export default class TestBase {
  private dbOperator: DBOperator | undefined;

  public users: TestUser[];

  constructor() {
    this.users = [];
  }

  public async connection() {
    const db = await mysql.createConnection(config.db);
    await db.connect();

    this.dbOperator = new DBOperator(db);
  }

  public get db() {
    if (typeof this.dbOperator === 'undefined') {
      throw new Error('no db');
    }

    return this.dbOperator;
  }

  public async newUser(
    options?: Partial<UserModel> | undefined
  ): Promise<TestUser> {
    const user = new TestUser(options);

    await user.create(this.db);

    this.users.push(user);

    return user;
  }

  public async multiUser(
    count: number,
    options?: Partial<UserModel> | undefined
  ): Promise<TestUser[]> {
    const users: TestUser[] = [];

    for (let i = 0; count > i; i++) {
      users.push(new TestUser(options));
    }

    this.users = this.users.concat(users);

    return users;
  }

  /**
   * 野良認証セッションを作成する。回答indexはすべて0です
   *
   * @param {number} score - 1つ1つの野良認証のスコア
   * @param {number} numberOfQuestions - 野良認証の個数
   * @returns {string} - 野良セッションのトークン
   */
  public async noraSession(
    score: number,
    numberOfQuestions: number
  ): Promise<{token: string; answers: {id: number; answer_index: number}[]}> {
    const questions: NoraQuestion[] = [];
    for (let i = 0; numberOfQuestions > i; i++) {
      const q = await createNoraQuestion(
        this.db,
        'title',
        [{index: 0, answerText: ''}],
        0,
        score
      );
      questions.push(q);
    }

    const questionIds = questions.map(v => v.id);

    const token = await createNoraSession(this.db, questionIds);

    return {
      token: token,
      answers: questions.map(v => ({
        id: v.id,
        answer_index: v.current_answer_index,
      })),
    };
  }

  public async end() {
    this.db.end();
  }
}
