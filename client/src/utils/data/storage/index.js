/**
 * 返回localStorage缓存
 * @param {string} key
 */
const getStorage = (key) =>
  new Promise((resolve, reject) => {
    try {
      window.localStorage.getItem(key);
      return resolve();
    } catch (error) {
      return reject(error);
    }
  });
const removeStorage = (key) => {
  window.localStorage.removeItem;
};

window.localStorage.setItem;
