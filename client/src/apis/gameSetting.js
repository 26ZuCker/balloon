import Taro from '@tarojs/taro';
import { BASE_API, promisifyHttp } from './apiConfig.js';

const errorMsgApiMap = {
  get_game_setting_template: { method: 'POST', url: 'get_userInfo_template' },
  submit_game_setting: { method: 'POST', url: 'submit_userInfo' },
};
/**
 * 获取配置所需模板
 */
/* const get_game_setting_template = promisifyHttp(
  Taro,
  BASE_API,
  errorMsgApiMap['get_game_setting_template']
); */
const get_game_setting_template = () => [
  { title: '实验类型', value: '' },
  { title: '本轮批次', value: '' },
  { title: '本轮组次', value: '' },
  { title: '实验时间', value: '' },
];

/**
 * 提交已更改的配置
 */
const submit_game_setting = promisifyHttp(Taro, BASE_API, errorMsgApiMap['submit_game_setting']);

export { get_game_setting_template, submit_game_setting };
