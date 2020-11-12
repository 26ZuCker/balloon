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
    game_type: { title: '随机爆破点分布方式', value: '', validator: {} },
    train_dialog: { title: '练习模式提示语', value: '', validator: {} },
    game_dialog: { title: '正式模式提示语', value: '', validator: {} },
    //round_num: { title: '总轮次，限定为1~3', value: '', validator: {} },
    round1_notice: { title: '第一轮提示语', value: '', validator: {} },
    round2_notice: { title: '第二轮提示语', value: '', validator: {}, id: 2 },
    round3_notice: { title: '第三轮提示语', value: '', validator: {}, id: 3 },
  };
};
/**
 * 提交已更改的配置
 */
const submit_game_setting = promisifyHttp(Taro, BASE_API, errorMsgApiMap['submit_game_setting']);

export { get_game_setting_template, submit_game_setting };
