/**
 * 封装taro的网络请求
 */
const promisifyHttp = (Taro, BASE_API, { url, method }) => (data = {}) =>
  new Promise((resolve, reject) => {
    Taro.request({
      url: `${BASE_API}/${url}`,
      method: method,
      data: data,
      success: function(res) {
        resolve(res);
      },
      fail: function(error) {
        reject(error);
      },
    });
  });
/**
 * 基地址
 */
const BASE_API = 'http://192.168.43.75:5000';
/**
 * 自定义响应码，有别于状态码，必须提前放置于前端
 */
const cusResCode = {
  ERROR: -1,
  SUCCESS: 1,
};

export { BASE_API, promisifyHttp, cusResCode };
