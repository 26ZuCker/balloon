import Taro from '@tarojs/taro';
import { BASE_API, promisifyHttp } from './apiConfig.js';

const errorMsgApiMap = {
  get_userInfo_template: { method: 'POST', url: 'get_userInfo_template' },
  submit_userInfo: { method: 'POST', url: 'submit_userInfo' },
};
/**
 * 获取用户所需填写信息模板
 */
const get_userInfo_template = promisifyHttp(Taro, BASE_API, errorMsgApiMap['get_userInfo_template']);
/**
 * 提交用户所填信息
 */
const submit_userInfo = promisifyHttp(Taro, BASE_API, errorMsgApiMap['submit_userInfo']);

export { get_userInfo_template, submit_userInfo };
