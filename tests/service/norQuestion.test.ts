import {randomInt} from 'crypto';
import mysql, {ResultSetHeader, RowDataPacket} from 'mysql2/promise';
import config from '../../config';
import {
  NoraQuestion,
  NoraQuestionModel,
  NoraQuestionSelect,
} from '../../src/models/noraQuestion';
import {
  createNoraQuestion,
  deleteNoraQuestionByID,
  findAllNoraQuestion,
  findNoraQuestionById,
  findRandomNoraQuestion,
  updateNoraQuestionByID,
} from '../../src/services/noraQuestion';

describe('noraQuestion', () => {
  let db: mysql.Connection;

  const answers: NoraQuestionSelect[] = [
    {
      index: 0,
      answerText: 'hogehoge',
    },
    {
      index: 1,
      answerText: 'hugahuga',
    },
  ];
  const title = 'nyaaa';
  const answerIndex = 1;
  const score = 90;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('createNoraQuestion', async () => {
    const q = await createNoraQuestion(db, title, answers, answerIndex, score);

    // 返ってくる値が正しい
    expect(typeof q.id === 'number').toBeTruthy();
    expect(q.question_title).toBe(title);
    expect(q.current_answer_index).toBe(answerIndex);
    expect(q.score).toBe(score);

    // dbに格納されている
    const [r] = await db.query<RowDataPacket[]>(
      'SELECT id FROM nora_question WHERE id = ?',
      q.id
    );

    expect(r[0].id).toBe(q.id);
  });

  test('findNoraQuestionById', async () => {
    const [rows] = await db.query<ResultSetHeader>(
      `INSERT INTO nora_question(
      question_title,
      answers,
      current_answer_index,
      score
    ) VALUES (?, ?, ?, ?)`,
      [title, JSON.stringify(answers), answerIndex, score]
    );

    const id = rows.insertId;

    const q = await findNoraQuestionById(db, id);

    const qq = new NoraQuestion({
      id: id,
      question_title: title,
      answers: answers,
      current_answer_index: answerIndex,
      score: score,
    });

    expect(q).toEqual(qq);
  });

  test('findAllNoraQuestion', async () => {
    const [rows] = await db.query<ResultSetHeader>(
      `INSERT INTO nora_question(
      question_title,
      answers,
      current_answer_index,
      score
    ) VALUES (?, ?, ?, ?)`,
      [title, JSON.stringify(answers), answerIndex, score]
    );

    const id = rows.insertId;

    const questions = await findAllNoraQuestion(db);

    // 0 = 空という判断
    expect(questions.length).not.toBe(0);

    // idのnora questionが存在する
    expect(questions.find(v => v.id === id)).not.toBeUndefined();
  });

  test('findRandomNoraQuestion', async () => {
    // 最低2個の問題を格納する
    for (let i = 0; 2 > i; ++i) {
      await db.query<ResultSetHeader>(
        `INSERT INTO nora_question(
        question_title,
        answers,
        current_answer_index,
        score
      ) VALUES (?, ?, ?, ?)`,
        [title, JSON.stringify(answers), answerIndex, score]
      );
    }

    const questions = await findRandomNoraQuestion(db, 2);

    expect(questions.length).toBe(2);
  });

  test('deleteNoraQuestionByID', async () => {
    const [rows] = await db.query<ResultSetHeader>(
      `INSERT INTO nora_question(
      question_title,
      answers,
      current_answer_index,
      score
    ) VALUES (?, ?, ?, ?)`,
      [title, JSON.stringify(answers), answerIndex, score]
    );

    const id = rows.insertId;

    await deleteNoraQuestionByID(db, id);

    // DBから消えている
    const [r] = await db.query<RowDataPacket[]>(
      'SELECT id FROM nora_question WHERE id = ?',
      id
    );

    expect(r.length).toBe(0);
  });

  test('存在しないIDでdeleteNoraQuestionByID', async () => {
    const id = randomInt(10);

    expect(async () => {
      await deleteNoraQuestionByID(db, id);
    }).not.toThrow();
  });

  test('updateNoraQuestionByID', async () => {
    const [rows] = await db.query<ResultSetHeader>(
      `INSERT INTO nora_question(
      question_title,
      answers,
      current_answer_index,
      score
    ) VALUES (?, ?, ?, ?)`,
      [title, JSON.stringify(answers), answerIndex, score]
    );

    const id = rows.insertId;

    const updateTitle = 'aaaaaa';
    const updateAnswers: NoraQuestionSelect[] = [
      {
        index: 0,
        answerText: 'hogehoge',
      },
    ];
    const updateAnswerIndex = 0;
    const updateScore = 100;

    try {
      await updateNoraQuestionByID(db, id, {
        question_title: updateTitle,
        answers: updateAnswers,
        current_answer_index: updateAnswerIndex,
        score: updateScore,
      });
    } catch (e) {
      expect(e).not.toThrow();
    }

    // DB更新されている
    const [r] = await db.query<RowDataPacket[]>(
      'SELECT * FROM nora_question WHERE id = ?',
      id
    );

    const q = new NoraQuestion({
      id: id,
      question_title: updateTitle,
      answers: updateAnswers,
      current_answer_index: updateAnswerIndex,
      score: updateScore,
    });

    expect(r.length).not.toBe(0);
    expect(new NoraQuestion(r[0] as NoraQuestionModel)).toEqual(q);
  });

  test('updateNoraQuestionByIDで範囲外のcurrent_answer_indexを更新する', async () => {
    const [rows] = await db.query<ResultSetHeader>(
      `INSERT INTO nora_question(
      question_title,
      answers,
      current_answer_index,
      score
    ) VALUES (?, ?, ?, ?)`,
      [title, JSON.stringify(answers), answerIndex, score]
    );

    const id = rows.insertId;

    expect(async () => {
      await updateNoraQuestionByID(db, id, {
        current_answer_index: 10, // 範囲外に更新する
      });
    }).rejects.toThrow('answerIndex is out of answers index');

    expect(async () => {
      await updateNoraQuestionByID(db, id, {
        current_answer_index: -1, // 負の値
      });
    }).rejects.toThrow('answerIndex is out of answers index');
  });

  test('updateNoraQuestionByIDで範囲外になるようなanswersを更新する', async () => {
    const [rows] = await db.query<ResultSetHeader>(
      `INSERT INTO nora_question(
      question_title,
      answers,
      current_answer_index,
      score
    ) VALUES (?, ?, ?, ?)`,
      [title, JSON.stringify(answers), answerIndex, score]
    );

    const id = rows.insertId;

    expect(async () => {
      await updateNoraQuestionByID(db, id, {
        answers: [{index: 0, answerText: 'aaaa'}], // length = 1 にする
      });
    }).rejects.toThrow('answerIndex is out of answers index');
  });

  test('updateNoraQuestionByIDで範囲外になるようなanswersとcurrent_answer_indexを更新する', async () => {
    const [rows] = await db.query<ResultSetHeader>(
      `INSERT INTO nora_question(
      question_title,
      answers,
      current_answer_index,
      score
    ) VALUES (?, ?, ?, ?)`,
      [title, JSON.stringify(answers), answerIndex, score]
    );

    const id = rows.insertId;

    expect(async () => {
      await updateNoraQuestionByID(db, id, {
        answers: [{index: 0, answerText: 'aaaa'}], // length = 1 にする
        current_answer_index: 10, // 範囲外
      });
    }).rejects.toThrow('answerIndex is out of answers index');

    expect(async () => {
      await updateNoraQuestionByID(db, id, {
        answers: [{index: 0, answerText: 'aaaa'}], // length = 1 にする
        current_answer_index: -100, // 負の値
      });
    }).rejects.toThrow('answerIndex is out of answers index');
  });

  test('updateNoraQuestionByIDでtitleだけのように1つのカラムで更新できる', async () => {
    const [rows] = await db.query<ResultSetHeader>(
      `INSERT INTO nora_question(
      question_title,
      answers,
      current_answer_index,
      score
    ) VALUES (?, ?, ?, ?)`,
      [title, JSON.stringify(answers), answerIndex, score]
    );

    const id = rows.insertId;

    const updateTitle = 'aaaaaa';

    try {
      await updateNoraQuestionByID(db, id, {
        question_title: updateTitle,
      });
    } catch (e) {
      expect(e).not.toThrow();
    }

    // DB更新されている
    const [r] = await db.query<RowDataPacket[]>(
      'SELECT * FROM nora_question WHERE id = ?',
      id
    );

    const q = new NoraQuestion({
      id: id,
      question_title: updateTitle,
      answers: answers,
      current_answer_index: answerIndex,
      score: score,
    });

    expect(r.length).not.toBe(0);
    expect(new NoraQuestion(r[0] as NoraQuestionModel)).toEqual(q);
  });
});
