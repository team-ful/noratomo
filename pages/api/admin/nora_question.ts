import {get, post, put, _delete} from '../../../src/admin/noraQuestion';
import {switchMethod} from '../../../src/base/switchMethod';

// 野良認証の問題を作成、修正、削除をするメソッド
// * 管理者のみ
export default switchMethod({
  GET: get,
  POST: post,
  PUT: put,
  DELETE: _delete,
});
