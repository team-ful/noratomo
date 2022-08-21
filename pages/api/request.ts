import {switchMethod} from '../../src/base/switchMethod';
import {post, _delete, get} from '../../src/request';

export default switchMethod<unknown>({
  POST: post,
  DELETE: _delete,
  GET: get,
});
