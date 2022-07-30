import {handlerWrapper} from '../../../src/base/handlerWrapper';
import {shopSearch} from '../../../src/shop/search';

export default handlerWrapper(shopSearch, 'GET');
