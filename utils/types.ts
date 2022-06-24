export interface User {
  display_name: string;
  mail: string;
  profile: string;
  user_name: string;
  age: number;
  gender: number;
  is_admin: boolean;
  avatar_url: string;
  join_date: Date;
}

export interface Question {
  id: number;
  question_title: string;
  answers: {index: number; answerText: string}[];
  current_answer_index: number;
  score: number;
}
