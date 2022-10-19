import { Message } from 'element-ui';
import debounce from 'lodash/debounce';

export default debounce(function (config) {
    Message(config);
}, 1000);
