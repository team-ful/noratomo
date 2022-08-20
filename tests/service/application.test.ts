import {mode} from '@chakra-ui/theme-tools';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {ApplicationModel} from '../../src/models/application';
import {
  createApplication,
  deleteApplicationByEntryId,
  deleteApplicationById,
  deleteApplicationByUserId,
  findApplicationsByUserId,
} from '../../src/services/application';
import TestBase from '../../src/tests/base';
import {
  createApplicationModel,
  createEntryModel,
  createUserModel,
} from '../../src/tests/models';

describe('application', () => {
  const base = new TestBase();

  beforeAll(async () => {
    await base.connection();
  });

  afterAll(async () => {
    await base.end();
  });

  const create = async (model: ApplicationModel): Promise<number> => {
    const result = await base.db.test<ResultSetHeader>(
      'INSERT INTO application (user_id, entry_id, is_met, is_closed) VALUES (?, ?, ?, ?)',
      [model.user_id, model.entry_id, model.is_met, model.is_closed]
    );

    return result.insertId;
  };

  test('createApplication', async () => {
    const model = createApplicationModel();

    const id = await createApplication(base.db, model.user_id, model.entry_id);

    const rows = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM application WHERE id = ?',
      [id]
    );

    expect(rows.length).toBe(1);
  });

  test('findApplicationsByUserId', async () => {
    const user = createUserModel();

    const model = createApplicationModel({user_id: user.id});
    await create(model);

    const metModel = createApplicationModel({user_id: user.id, is_met: true});
    const metId = await create(metModel);

    const closedModel = createApplicationModel({
      user_id: user.id,
      is_closed: true,
    });
    const closedId = await create(closedModel);

    const metAndClosedModel = createApplicationModel({
      user_id: user.id,
      is_met: true,
      is_closed: true,
    });
    const metAndClosedId = await create(metAndClosedModel);

    const applications = await findApplicationsByUserId(base.db, user.id, {});
    expect(applications.length).toBe(4);

    const metApplications = await findApplicationsByUserId(base.db, user.id, {
      is_met: true,
    });
    expect(metApplications.length).toBe(2);
    expect(metApplications.find(v => v.id === metId)).toBeTruthy();

    const closedApplication = await findApplicationsByUserId(base.db, user.id, {
      is_closed: true,
    });
    expect(closedApplication.length).toBe(2);
    expect(closedApplication.find(v => v.id === closedId)).toBeTruthy();

    const metAndClosedApplication = await findApplicationsByUserId(
      base.db,
      user.id,
      {
        is_met: true,
        is_closed: true,
      }
    );
    expect(metAndClosedApplication.length).toBe(1);
    expect(metAndClosedApplication[0].id).toBe(metAndClosedId);
  });

  test('deleteApplicationById', async () => {
    const model = createApplicationModel();
    const id = await create(model);

    const rows = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM application WHERE id = ?',
      [id]
    );
    expect(rows.length).toBe(1);

    await deleteApplicationById(base.db, id);

    const deletedRow = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM application WHERE id = ?',
      [id]
    );
    expect(deletedRow.length).toBe(0);
  });

  test('deleteApplicationByUserId', async () => {
    const user = createUserModel();

    const model = createApplicationModel({user_id: user.id});
    await create(model);
    await create(model);

    const rows = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM application WHERE user_id = ?',
      [user.id]
    );
    expect(rows.length).toBe(2);

    await deleteApplicationByUserId(base.db, user.id);

    const deletedRow = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM application WHERE user_id = ?',
      [user.id]
    );
    expect(deletedRow.length).toBe(0);
  });

  test('deleteApplicationByEntryId', async () => {
    const model = createApplicationModel();
    await create(model);
    await create(model);

    const rows = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM application WHERE entry_id = ?',
      [model.entry_id]
    );
    expect(rows.length).toBe(2);

    await deleteApplicationByEntryId(base.db, model.entry_id);

    const deletedRow = await base.db.test<RowDataPacket[]>(
      'SELECT * FROM application WHERE user_id = ?',
      [model.entry_id]
    );
    expect(deletedRow.length).toBe(0);
  });
});
