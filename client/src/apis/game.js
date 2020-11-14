import Taro from '@tarojs/taro';
import { BASE_API, promisifyHttp } from './apiConfig.js';

const errorMsgApiMap = {
  get_form_template: { method: 'POST', url: 'get_form_template' },
  get_game_setting: { method: 'POST', url: 'get_game_setting' },
  get_bomb_arr: { method: 'POST', url: 'get_bomb_arr' },
};

/**
 * 获取个人模式所需数据模板
 */
const get_form_template = promisifyHttp(Taro, BASE_API, errorMsgApiMap['get_form_template']);
/**
 * 获取游戏配置
 */
const get_game_setting = () => {
  return {
    game_type: { title: '随机爆破点分布方式', value: '' },
    train_dialog: { title: '练习模式提示语', value: '' },
    game_dialog: { title: '正式模式提示语', value: '' },
    round1_notice: { title: '第一轮提示语', value: '' },
    round2_notice: { title: '第二轮提示语', value: '' },
  };
};
/**
 * 获取爆破点数组
 */
//const get_bomb_arr = promisifyHttp(Taro, BASE_API, errorMsgApiMap['get_bomb_arr']);
const get_bomb_arr = () => {
  return Array.from({ length: 30 }, (_, i) => i + 1);
};
export { get_form_template, get_game_setting, get_bomb_arr };
