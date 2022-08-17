import Notice from '../../src/models/notice';
import {createNoticeModel} from '../../src/tests/models';

describe('notice', () => {
  test('作成できる', () => {
    const noticeModel = createNoticeModel();

    const notice = new Notice(noticeModel);

    expect(notice.id).toBe(noticeModel.id);
  });
});
