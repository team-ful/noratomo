import {ApiError} from '../base/apiError';
import DBOperator, {DefaultObject} from '../db/operator';
import {findEntryById} from '../services/entry';
import {findUserByUserID} from '../services/user';
import Entry from './entry';
import {ExternalPublicUser} from './user';

export interface ApplicationModel {
  id: number;
  entry_id: number;
  user_id: number;
  apply_date: Date;
  is_met: boolean;
  is_closed: boolean;
}

export interface FillUserApplication {
  id: number;
  apply_date: Date;
  is_met: boolean;
  is_closed: boolean;
  user: ExternalPublicUser;
}

export class Application implements ApplicationModel {
  readonly id: number;
  readonly entry_id: number;
  readonly user_id: number;
  readonly apply_date: Date;
  readonly is_met: boolean;
  readonly is_closed: boolean;

  constructor(init: DefaultObject | ApplicationModel) {
    this.id = init.id as number;
    this.entry_id = init.entry_id as number;
    this.user_id = init.user_id as number;
    this.apply_date = new Date(init.apply_date as string);
    this.is_met = Boolean(init.is_met);
    this.is_closed = Boolean(init.is_closed);
  }

  public async getEntry(db: DBOperator): Promise<Entry> {
    const entry = await findEntryById(db, this.entry_id);
    if (entry === null) {
      throw new ApiError(500, 'entry not found');
    }
    return entry;
  }

  public async jsonFillUser(db: DBOperator): Promise<FillUserApplication> {
    const user = await findUserByUserID(db, this.user_id);

    return {
      id: this.id,
      apply_date: this.apply_date,
      is_met: this.is_met,
      is_closed: this.is_closed,
      user: user.externalPublicUser(),
    };
  }
}
