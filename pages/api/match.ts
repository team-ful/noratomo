import {PageConfig} from 'next';
import {switchMethod} from '../../src/base/switchMethod';
import {post, get} from '../../src/match';

// multipart/form-dataはbodyParserをfalseにしないと動かない
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default switchMethod<unknown>({
  POST: post,
  GET: get,
});
