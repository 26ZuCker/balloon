import Taro from '@tarojs/taro';
import { BASE_API, promisifyHttp } from './apiConfig.js';

const errorMsgApiMap = {
  getAllBatch: { method: 'POST', url: 'getAllBatch' },
  downloadExcel: { method: 'POST', url: 'downloadExcel' },
};
/**
 * 获取所有的批次序号
 */
const getAllBatch = promisifyHttp(Taro, BASE_API, errorMsgApiMap['getAllBatch']);
/**
 * 获取批次数据表格下载链接
 */
const downloadExcel = promisifyHttp(Taro, BASE_API, errorMsgApiMap['downloadExcel']);

export { getAllBatch, downloadExcel };
