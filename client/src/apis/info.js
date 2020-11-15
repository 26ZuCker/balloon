import Taro from '@tarojs/taro';
import { BASE_API, promisifyHttp } from './config.js';

const errorMsgApiMap = {
  get_all_batch: { method: 'POST', url: 'getAllBatch' },
  download_excel: { method: 'POST', url: 'downloadExcel' },
};
/**
 * 获取所有的批次序号
 */
const get_all_batch = promisifyHttp(Taro, BASE_API, errorMsgApiMap['get_all_batch']);
/**
 * 获取批次数据表格下载链接
 */
const download_excel = promisifyHttp(Taro, BASE_API, errorMsgApiMap['download_excel']);

export { get_all_batch, download_excel };
