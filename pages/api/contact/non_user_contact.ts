import {PageConfig} from 'next';
import {handlerWrapper} from '../../../src/base/handlerWrapper';
import {contactHandler} from '../../../src/contact/sendContact';

// multipart/form-dataはbodyParserをfalseにしないと動かない
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default handlerWrapper(contactHandler, 'POST');
