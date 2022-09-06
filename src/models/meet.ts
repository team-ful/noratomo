import DBOperator, {DefaultObject} from '../db/operator';
import {findUserByUserID} from '../services/user';
import {ExternalPublicUser} from './user';

export interface MeetModel {
  id: number;
  entry_id: number;
  owner_id: number;
  apply_user_id: number;
  meet_date: Date;
  is_cancel: boolean;
  is_slapstick: boolean;

  // https://find.cateiru.com で使用するID
  find_id: string;
}

export class Meet implements MeetModel {
  readonly id: number;
  readonly entry_id: number;
  readonly owner_id: number;
  readonly apply_user_id: number;
  readonly meet_date: Date;
  readonly is_cancel: boolean;
  readonly is_slapstick: boolean;
  readonly find_id: string;

  constructor(init: DefaultObject | MeetModel) {
    this.id = init.id as number;
    this.entry_id = init.entry_id as number;
    this.owner_id = init.owner_id as number;
    this.apply_user_id = init.apply_user_id as number;

    this.meet_date = new Date(init.meet_date as string);

    this.is_cancel = Boolean(init.is_cancel);
    this.is_slapstick = Boolean(init.is_slapstick);

    this.find_id = init.find_id as string;
  }

  /**
   * 引数で指定したユーザがこのマッチと関係あるかどうかを調べる
   *
   * @param {number} userId - target user id
   * @returns {boolean} - ユーザが関係者の場合はtrue
   */
  public isConcernedUser(userId: number): boolean {
    return [this.owner_id, this.apply_user_id].includes(userId);
  }

  /**
   * 相手のユーザ情報を取得する
   *
   * @param {DBOperator} db - database
   * @param {number} myUserId - 自分のユーザID
   * @returns {ExternalPublicUser} - 相手のユーザ情報
   */
  public async getPartner(
    db: DBOperator,
    myUserId: number
  ): Promise<ExternalPublicUser> {
    let partnerId;
    if (this.owner_id === myUserId) {
      partnerId = this.apply_user_id;
    } else {
      partnerId = this.owner_id;
    }

    const user = await findUserByUserID(db, partnerId);

    return user.externalPublicUser();
  }
}
