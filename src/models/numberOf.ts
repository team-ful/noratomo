import {DefaultObject} from '../db/operator';

export interface NumberOfModel {
  user_id: number;
  evaluations: number;
  meet: number;
  application: number;
}

export class NumberOf implements NumberOfModel {
  readonly user_id: number;
  readonly evaluations: number;
  readonly meet: number;
  readonly application: number;

  constructor(init: DefaultObject | NumberOfModel) {
    this.user_id = init.user_id as number;
    this.evaluations = init.evaluations as number;
    this.meet = init.meet as number;
    this.application = init.application as number;
  }
}
