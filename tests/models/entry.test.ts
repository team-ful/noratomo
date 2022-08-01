import Entry from '../../src/models/entry';
import {createEntryModel} from '../../src/tests/models';

describe('shop', () => {
  test('作成できる', () => {
    const entry = createEntryModel();

    const e = new Entry(entry);

    expect(e.body).toBe(entry.body);
    expect(e.id).toBe(entry.id);
  });
});
