import {ResultSetHeader} from 'mysql2';
import {Application} from '../../src/models/application';
import TestBase from '../../src/tests/base';
import {createApplicationModel, createEntryModel} from '../../src/tests/models';

describe('application', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  test('作成できる', () => {
    const applicationModel = createApplicationModel();

    const application = new Application(applicationModel);

    expect(application.id).toBe(applicationModel.id);
  });

  test('getEntry', async () => {
    const entryModel = createEntryModel();
    const row = await base.db.test<ResultSetHeader>(
      `INSERT INTO entry (
      owner_user_id,
      title,
      shop_id,
      number_of_people,
      date,
      body,
      is_closed,
      meeting_lat,
      meeting_lon,
      meet_date
    ) VALUES (?, ?, ?, ?, NOW(), ?, false, ?, ?, ?)`,
      [
        entryModel.owner_user_id,
        entryModel.title,
        entryModel.shop_id,
        entryModel.number_of_people,
        entryModel.body,
        entryModel.meeting_lat,
        entryModel.meeting_lon,
        entryModel.meet_date,
      ]
    );
    entryModel.id = row.insertId;

    const applicationModel = createApplicationModel({entry_id: entryModel.id});
    const application = new Application(applicationModel);

    const entry = await application.getEntry(base.db);

    expect(entry.shop_id).toBe(entryModel.shop_id);
  });
});
