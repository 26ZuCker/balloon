import Taro from '@tarojs/taro';
import { BASE_API, promisifyHttp } from './config.js';

const errorMsgApiMap = {
  get_userInfo_template: { method: 'POST', url: 'get_userInfo_template' },
  submit_userInfo: { method: 'POST', url: 'submit_userInfo' },
  login: { method: 'POST', url: 'login' },
};
/**
 * 获取用户所需填写信息模板
 */
/* const get_userInfo_template = promisifyHttp(
  Taro,
  BASE_API,
  errorMsgApiMap['get_userInfo_template']
); */
const get_userInfo_template = () => {
  return {
    batch: {
      title: '批次',
      value: '',
      validator: { validType: 'REG', selfType: 'positiveInteger' },
    },
    alipay: { title: '支付宝账号', value: '', validator: {} },
    group: {
      title: '组次',
      value: '',
      validator: { validType: 'REG', selfType: 'positiveInteger' },
    },
    name: { title: '姓名', value: '', validator: {} },
    phone_number: {
      title: '手机号码',
      value: '',
      validator: { validType: 'REG', selfType: 'phone' },
    },
    school_number: { title: '学号', value: '', validator: {} },
  };
};
/**
 * 提交用户所填信息
 */
const submit_userInfo = promisifyHttp(Taro, BASE_API, errorMsgApiMap['submit_userInfo']);
/**
 * 获取角色
 */
const login = promisifyHttp(Taro, BASE_API, errorMsgApiMap['login']);

export { get_userInfo_template, submit_userInfo, login };
