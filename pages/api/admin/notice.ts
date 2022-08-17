import {PageConfig} from 'next';
import {noticeAllUserHandler} from '../../../src/admin/notice';
import {authHandlerWrapper} from '../../../src/base/handlerWrapper';

// multipart/form-dataはbodyParserをfalseにしないと動かない
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default authHandlerWrapper(noticeAllUserHandler, 'POST');
