import {switchMethod} from '../../src/base/switchMethod';
import deleteUser from '../../src/user/delete';

export default switchMethod({
  DELETE: deleteUser,
});
