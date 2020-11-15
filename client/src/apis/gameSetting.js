import Taro from '@tarojs/taro';
import { BASE_API, promisifyHttp } from './apiConfig.js';

const errorMsgApiMap = {
  get_game_setting_template: { method: 'POST', url: 'get_userInfo_template' },
  submit_game_setting: { method: 'POST', url: 'submit_userInfo' },
};
/**
 * 获取配置所需模板，
 * 批次
 * 总轮次1-3
 * 练习提示框
 * 游戏提示框
 * 每轮顶部提示条
 * 随机爆破点分布方式
 * 该批结束时间
 */
const get_game_setting_template = () => {
  return {
    batch: { title: '批次', value: '', validator: {} },
    end_time: { title: '结束时间', value: '', validator: {} },
    blast_point_distribution: { title: '随机爆破点分布方式', value: '', validator: {} },
    practice_tips: { title: '练习模式提示语', value: '', validator: {} },
    game_tips: { title: '正式模式提示语', value: '', validator: {} },
    round1_notice: { title: '个人模式提示语', value: '', validator: {} },
    round2_notice: { title: '团队模式提示语', value: '', validator: {} },
  };
};
/**
 * 提交已更改的配置
 */
const submit_game_setting = promisifyHttp(Taro, BASE_API, errorMsgApiMap['submit_game_setting']);

export { get_game_setting_template, submit_game_setting };
