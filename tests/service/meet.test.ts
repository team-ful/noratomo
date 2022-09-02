import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {MeetModel} from '../../src/models/meet';
import {
  createMeet,
  findMeetByEntryId,
  findMeetById,
} from '../../src/services/meet';
import TestBase from '../../src/tests/base';
import {createMeetModel} from '../../src/tests/models';

describe('meet', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  const create = async (model: MeetModel): Promise<number> =>
    (
      await base.db.test<ResultSetHeader>(
        `INSERT INTO meet(
      entry_id,
      owner_id,
      apply_user_id,
      find_id
    ) VALUES (?, ?, ?, ?)`,
        [model.entry_id, model.owner_id, model.apply_user_id, model.find_id]
      )
    ).insertId;

  test('createMeet', async () => {
    const meetModel = createMeetModel();

    const id = await createMeet(
      base.db,
      meetModel.entry_id,
      meetModel.owner_id,
      meetModel.apply_user_id
    );

    const row = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM meet WHERE id = ?',
      [id]
    );

    expect(row.length).toBe(1);
    expect(row[0].entry_id).toBe(meetModel.entry_id);
  });

  test('findMeetById', async () => {
    const meetModel = createMeetModel();
    const id = await create(meetModel);

    const meet = await findMeetById(base.db, id);

    expect(meet?.owner_id).toBe(meetModel.owner_id);
  });

  test('findMeetByEntryId', async () => {
    const meetModel = createMeetModel();
    await create(meetModel);

    const meet = await findMeetByEntryId(base.db, meetModel.entry_id);

    expect(meet?.owner_id).toBe(meetModel.owner_id);
  });
});
