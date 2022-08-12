import DBOperator, {DefaultObject} from '../db/operator';
import {findNoraQuestionsByIds} from '../services/noraQuestion';
import {NoraQuestion} from './noraQuestion';

export interface NoraSessionModel {
  token: string;

  question_ids: string;
}

export class NoraSession implements NoraSessionModel {
  readonly token: string;
  readonly question_ids: string;

  readonly ids: number[];

  constructor(init: DefaultObject | NoraSessionModel) {
    this.token = init['token'] as string;
    this.question_ids = init['question_ids'] as string;

    const idsStr = this.question_ids.split(/,\s?/);

    this.ids = idsStr.map(v => parseInt(v));
  }

  public async noraQuestions(db: DBOperator): Promise<NoraQuestion[]> {
    if (this.ids.length === 0) {
      return [];
    }

    return await findNoraQuestionsByIds(db, this.ids);
  }
}
