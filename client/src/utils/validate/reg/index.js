//正则入口文件
//数字
import { phone, positiveInteger } from './number.js';
//名字
import { name } from './name.js';
/**
 * 正则映射
 */
const regMap = {
  positiveInteger: positiveInteger,
  phone: phone,
  name: name,
};
/**
 * 校验正则
 * @param {any} target
 * @param {string} type
 */
function validateReg(target, type) {
  return regMap[type].test(target);
}
export default validateReg;
