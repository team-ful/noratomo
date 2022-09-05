// pages/api/admin/notice.ts 同じ役割
// src/services/sendContact.ts にデータを転送する

import {PageConfig} from 'next';
import {authHandlerWrapper} from '../../../src/base/handlerWrapper';
import {handlerWrapper} from '../../../src/base/handlerWrapper';
import {contactHandler} from '../../../src/services/sendContact';

// multipart/form-dataはbodyParserをfalseにしないと動かない
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default handlerWrapper(contactHandler, 'POST');
