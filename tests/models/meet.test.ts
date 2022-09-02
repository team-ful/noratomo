import {Meet} from '../../src/models/meet';
import {createMeetModel} from '../../src/tests/models';

describe('meet', () => {
  test('作成できる', () => {
    const meetModel = createMeetModel();
    const meet = new Meet(meetModel);

    expect(meet.id).toBe(meetModel.id);
    expect(meet.shop_id).toBe(meetModel.shop_id);
    expect(meet.entry_id).toBe(meetModel.entry_id);
    expect(meet.owner_id).toBe(meetModel.owner_id);
  });
});
