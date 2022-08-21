import {switchMethod} from '../../src/base/switchMethod';
import {post, _delete} from '../../src/request';

export default switchMethod({
  POST: post,
  DELETE: _delete,
});
