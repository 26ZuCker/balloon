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
const get_game_settings = promisifyHttp(Taro, BASE_API, errorMsgApiMap['get_game_settings']);
/**
 * 获取实时更新数据
 */
const _update = promisifyHttp(Taro, BASE_API, errorMsgApiMap['_update']);
/**
 * 提交游戏数据和个人信息
 */
const _submit = promisifyHttp(Taro, BASE_API, errorMsgApiMap['_submit']);

export { get_game_settings, _update, _submit };
