import getType from './getType.js';
import isArray from './isArray.js';
import isObject from './isObject.js';
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
export default validateType;
export { isArray, isObject, getType };
