import {authHandlerWrapper} from '../../../src/base/handlerWrapper';
import {switchMethod} from '../../../src/base/switchMethod';
import {setConfigHandler} from '../../../src/user/config/configPut';
import getH from './me';

const putH = authHandlerWrapper(setConfigHandler);

export default switchMethod({
  GET: getH,
  PUT: putH,
});
