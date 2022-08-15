import {handlerWrapper} from '../../src/base/handlerWrapper';
import {getNoraQuestionHandler} from '../../src/question/get';

export default handlerWrapper(getNoraQuestionHandler, 'GET');
