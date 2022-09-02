import {switchMethod} from '../../src/base/switchMethod';
import {post, get} from '../../src/match';

export default switchMethod<unknown>({
  POST: post,
  GET: get,
});
