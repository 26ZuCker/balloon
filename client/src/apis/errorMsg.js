import Taro from '@tarojs/taro';
import apiConfig from './apiConfig.js';

const { BASE_API, promisifyHttp } = apiConfig;

const errorMsgApiMap = {
  get_error_msg: { method: 'POST', url: 'get_error_msg' },
};

const get_error_msg = promisifyHttp(Taro, BASE_API, errorMsgApiMap['get_error_msg']);

//export { get_error_msg };
