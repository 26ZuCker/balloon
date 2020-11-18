//正则入口文件
//数字
export { phone, positiveInteger } from './number.js';
//名字
export { name } from './name.js';
/**
 * 校验正则
 * @param {any} target
 * @param {string} type
 */
function validateReg(target, type) {
  return regMap[type]?.test(target) || true;
}
export default validateReg;
