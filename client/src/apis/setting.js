import Taro from '@tarojs/taro';
import { BASE_API, promisifyHttp } from './config.js';

const errorMsgApiMap = {
  get_game_setting_template: { method: 'POST', url: 'get_userInfo_template' },
  submit_game_setting: { method: 'POST', url: 'setup' },
};
/**
 * 获取配置所需模板
 */
const get_game_setting_template = () => {
  return {
    batch: { title: '批次', value: '', validator: {} },
    round: { title: '组次', value: '', validator: {} },
    blast_point_distribution: { title: '', value: '', validator: {} },
    is_update: { title: '', value: '', validator: {} },
    game_mode: { title: '', value: '', validator: {} },
    practice_tips: { title: '', value: '', validator: {} },
    end_time: { title: '', value: '', validator: {} },
  };
};
/**
 * 提交已更改的配置
 */
const submit_game_setting = promisifyHttp(Taro, BASE_API, errorMsgApiMap['submit_game_setting']);

export { get_game_setting_template, submit_game_setting };
