import {PageConfig} from 'next';
import {authHandlerWrapper} from '../../../src/base/handlerWrapper';
import {updateAvatarHandler} from '../../../src/user/config/avatar';

// multipart/form-dataはbodyParserをfalseにしないと動かない
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default authHandlerWrapper(updateAvatarHandler, 'POST');
