import Taro from '@tarojs/taro';
import { BASE_API, promisifyHttp } from './config.js';

const errorMsgApiMap = {
  get_game_settings: { method: 'POST', url: 'getGameSettings' },
  _update: { method: 'POST', url: 'update' },
  _submit: { method: 'POST', url: 'submit' },
};
/**
 * 获取游戏配置
 */
const get_game_settings = () => {
  return {
    game_type: { title: '随机爆破点分布方式', value: '' },
    train_dialog: { title: '练习模式提示语', value: '' },
    game_dialog: { title: '正式模式提示语', value: '' },
    round1_notice: { title: '第一轮提示语', value: '' },
    round2_notice: { title: '第二轮提示语', value: '' },
  };
};
/**
 * 获取实时更新数据
 */
const _update = promisifyHttp(Taro, BASE_API, errorMsgApiMap['_update']);
/**
 * 提交游戏数据
 */
const _submit = promisifyHttp(Taro, BASE_API, errorMsgApiMap['_submit']);

export { get_game_settings, _update, _submit };
