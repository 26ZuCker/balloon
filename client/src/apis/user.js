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
    name: { title: '姓名', value: '' },
    stu_id: { title: '学号', value: '' },
    Alipay: { title: '支付宝账号', value: '' },
    phone_number: { title: '电话', value: '' },
    batch: { title: '批次', value: '' },
    group_num: { title: '组次', value: '' },
  };
};
/**
 * 提交用户所填信息
 */
const submit_userInfo = promisifyHttp(Taro, BASE_API, errorMsgApiMap['submit_userInfo']);
/**
 * 根据openid登录获取角色
 */
const login = promisifyHttp(Taro, BASE_API, errorMsgApiMap['login']);

export { get_userInfo_template, submit_userInfo, login };
