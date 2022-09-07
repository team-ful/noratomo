import {PageConfig} from 'next';
import {authHandlerWrapper} from '../../../src/base/handlerWrapper';
import {contactUserHandler} from '../../../src/services/conatact/sendUserContact';

// multipart/form-dataはbodyParserをfalseにしないと動かない
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default authHandlerWrapper(contactUserHandler, 'POST');
