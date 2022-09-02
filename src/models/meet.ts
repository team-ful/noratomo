import {DefaultObject} from '../db/operator';

export interface MeetModel {
  id: number;
  entry_id: number;
  owner_id: number;
  apply_user_id: number;
  meet_date: Date;
  approve_date: Date | null;
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
  readonly approve_date: Date | null;
  readonly is_cancel: boolean;
  readonly is_slapstick: boolean;
  readonly find_id: string;

  constructor(init: DefaultObject | MeetModel) {
    this.id = init.id as number;
    this.entry_id = init.entry_id as number;
    this.owner_id = init.owner_id as number;
    this.apply_user_id = init.apply_user_id as number;

    this.meet_date = new Date(init.meet_date as string);
    if (init.approve_date !== null) {
      this.approve_date = new Date(init.approve_date as string);
    } else {
      this.approve_date = null;
    }

    this.is_cancel = Boolean(init.is_cancel);
    this.is_slapstick = Boolean(init.is_slapstick);

    this.find_id = init.find_id as string;
  }
}
