import {switchMethod} from '../../../src/base/switchMethod';
import {get, put} from '../../../src/user/notice';

export default switchMethod<unknown>({
  GET: get,
  PUT: put,
});
