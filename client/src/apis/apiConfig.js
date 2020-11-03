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

const BASE_API = 'http://192.168.43.75:5000';

/* export default {
  BASE_API,
  promisifyHttp,
}; */
