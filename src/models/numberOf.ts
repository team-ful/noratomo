import {DefaultObject} from '../db/operator';

export interface NumberOfModel {
  user_id: number;
  evaluations: number;
  entry: number;
  meet: number;
  application: number;
}

export interface External {
  evaluations: number;
  entry: number;
  meet: number;
  application: number;
}

export class NumberOf implements NumberOfModel {
  readonly user_id: number;
  readonly evaluations: number;
  readonly entry: number;
  readonly meet: number;
  readonly application: number;

  constructor(init: DefaultObject | NumberOfModel) {
    this.user_id = init.user_id as number;
    this.evaluations = init.evaluations as number;
    this.entry = init.entry as number;
    this.meet = init.meet as number;
    this.application = init.application as number;
  }

  public external(): External {
    return {
      evaluations: this.evaluations,
      entry: this.entry,
      meet: this.meet,
      application: this.application,
    };
  }
}
