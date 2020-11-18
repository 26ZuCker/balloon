//正则
import { phone, name, positiveInteger } from './reg';
//类型
import getType from './type';
import { isArray, isObject } from './type';
/**
 * 正则映射
 */
const regMap = {
  positiveInteger: positiveInteger,
  phone: phone,
  name: name,
};
/**
 * 类型判断策略
 */
const typeMap = {
  ARRAY: isArray,
  OBJECT: isObject,
  NUMBER,
  STRING,
  SYMBOL,
  MAP,
  SET,
};
/**
 * 根据传入的校验类型返回相应的校验函数，后期必须检查能否tree-shaking
 * @param {string} validType 可选：TYPE，REG
 */
const validate = (target, validType = 'TYPE', selfType) => {
  if (validType === 'TYPE') {
    return validateType(target, selfType);
  } else if (validType === 'REG') {
    return validateReg(target, selfType);
  }
};
/**
 * 校验正则
 * @param {any} target
 * @param {string} type
 */
function validateReg(target, type) {
  return regMap[type]?.test(target) || true;
}
/**
 * 校验数据类型
 * @param {any} target
 * @param {string} type
 */
function validateType(target, type) {
  if (type === 'ARRAY' || type === 'OBJECT') {
    return typeMap[type](target);
  }
  return getType(target) === type;
}

export default validate;
