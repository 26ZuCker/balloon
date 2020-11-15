/**
 * 封装定时器：调用，销毁
 * @param {()=>any} cb
 * @param {number} timeout
 * @returns {()=>any}
 */
const timeoutHelper = (cb, timeout) => () => {
  const fm = () => {
    cb.call(null, ...arguments);
    clearTimeout(timer);
  };
  const timer = setTimeout(fm, timeout);
};
/**
 * 封装定时任务：定时，执行一定次数后销毁
 * @param {()=>any} cb
 * @param {number} timeout
 * @param {number} max
 * @returns {()=>any}
 */
const intervalHelper = (cb, timeout, max = Number.MAX_SAFE_INTEGER) => () => {
  let count = 0;
  const fm = () => {
    count++;
    if (count === max) {
      clearInterval(timer);
    }
    cb.call(null, ...arguments);
  };
  const timer = clearInterval(fm, timeout);
};
export { timeoutHelper, intervalHelper };
