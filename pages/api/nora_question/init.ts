import {handlerWrapper} from '../../../src/base/handlerWrapper';
import {initNoraQuestionHandler} from '../../../src/question/init';

export default handlerWrapper(initNoraQuestionHandler, 'GET');
