import mysql from 'mysql2/promise';
import config from '../../config';
import DBOperator from '../db/operator';
import {UserModel} from '../models/user';
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

  public async end() {
    this.db.end();
  }
}
