import {get} from '../../../src/admin/user';
import {switchMethod} from '../../../src/base/switchMethod';

// ユーザを参照したりするエンドポイント
// * 管理者のみ
export default switchMethod<unknown>({
  GET: get,
});
