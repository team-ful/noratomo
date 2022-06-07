import getH from './me';
import {authHandlerWrapper} from 'src/base/handlerWrapper';
import {switchMethod} from 'src/base/switchMethod';
import {setConfigHandler} from 'src/user/config/configPut';

const putH = authHandlerWrapper(setConfigHandler);

export default switchMethod({
  GET: getH,
  PUT: putH,
});
