import Taro from '@tarojs/taro';
import apiConfig from './apiConfig.js';

const { BASE_API, promisifyHttp } = apiConfig;

const errorMsgApiMap = {
  get_form_template: { method: 'POST', url: 'get_form_template' },
};

/**
 * 获取个人模式所需数据模板
 */
const get_form_template = promisifyHttp(Taro, BASE_API, errorMsgApiMap['get_form_template']);

export { get_form_template };
