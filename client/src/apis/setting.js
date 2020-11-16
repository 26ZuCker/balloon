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
    batch: { title: '批次', value: '', validator: { type: 'REG', reg: 'positiveInteger' } },
    money: { title: '每次点击收益', value: '', validator: {} },
    team_tips: { title: '团队提示', value: '', validator: {} },
    personal_tips: { title: '个人提示', value: '', validator: {} },
    //blast_point_distribution: { title: '爆破点分布方式', value: '', validator: {} },
    //game_mode: { title: '游戏模式', value: '', validator: {} },
    practice_tips: { title: '练习模式提示', value: '', validator: {} },
    game_tips: { title: '正式模式提示', value: '', validator: {} },
    end_time: { title: '结束时间', value: '', validator: {} },
    //is_update: { title: '批次', value: true, validator: {} },
  };
};
/**
 * 提交已更改的配置
 */
const submit_game_setting = promisifyHttp(Taro, BASE_API, errorMsgApiMap['submit_game_setting']);

export { get_game_setting_template, submit_game_setting };
