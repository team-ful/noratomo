import {DefaultObject} from '../db/operator';

export interface NoticeModel {
  id: number;

  user_id: number;

  title: string;

  text: string | null;

  url: string | null;

  is_read: boolean;

  created: Date;
}

class Notice implements NoticeModel {
  readonly id: number;
  readonly user_id: number;
  readonly title: string;
  readonly text: string | null;
  readonly url: string | null;
  readonly is_read: boolean;
  readonly created: Date;

  constructor(init: DefaultObject | NoticeModel) {
    this.id = init.id as number;
    this.user_id = init.user_id as number;
    this.title = init.title as string;
    this.is_read = Boolean(init.is_read);

    this.text = init.text as string | null;
    this.url = init.url as string | null;

    this.created = new Date(init.created);
  }
}

export default Notice;
