export interface NoraQuestionModel {
  id: number;

  // 問題のタイトル
  question_title: string;

  // 答えの選択肢
  answers: NoraQuestionSelect[];

  // 答えの回答
  current_answer_index: number;

  // この問題の重み
  score: number;
}

export interface NoraQuestionSelect {
  index: number;
  answerText: string;
}

// 野良認証
export class NoraQuestion implements NoraQuestionModel {
  readonly id: number;
  readonly question_title: string;
  readonly answers: NoraQuestionSelect[];
  readonly current_answer_index: number;
  readonly score: number;

  constructor(init: NoraQuestionModel) {
    this.id = init.id;
    this.question_title = init.question_title;

    if (typeof init.answers === 'object') {
      this.answers = init.answers;
    } else {
      this.answers = JSON.parse(init.answers) as NoraQuestionSelect[];
    }

    this.current_answer_index = init.current_answer_index;
    this.score = init.score;
  }

  // 回答を返す
  get answer(): NoraQuestionSelect {
    return this.answers[this.current_answer_index];
  }

  // current_answer_indexがanswersの範囲内に存在するかチェックする
  // 回答が存在しない場合はundefined
  public checkAnswer(): boolean | undefined {
    const answerLen = this.answers.length;

    if (answerLen === 0) {
      return;
    }

    return (
      answerLen > this.current_answer_index && this.current_answer_index >= 0
    );
  }
}
