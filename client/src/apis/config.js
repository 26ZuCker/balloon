/**
 * 封装taro的网络请求
 * 注意：该方法只用于返回值而不做错误或成功后的处理因为前者有差异
 */
const promisifyHttp = (Taro, BASE_API, { url, method }) => (data = {}) =>
  new Promise((resolve, reject) => {
    Taro.cloud
      .callFunction({
        name: url,
        data: data,
      })
      .then((res) => {
        const { code, message, data } = res;
        if (code === cusResCode.SUCCESS) {
          resolve(data || message);
        } else {
          reject(message);
        }
      })
      .catch((error) => {
        const { code, message } = error;
        reject(message);
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
  ERROR: 101,
  SUCCESS: 100,
};

export { BASE_API, promisifyHttp, cusResCode };
