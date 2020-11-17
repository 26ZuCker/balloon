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
        console.log(res);
        const { result } = res;
        const { code, message, data } = result;
        //成功响应
        if (code === cusResCode.SUCCESS) {
          console.log(url + ' success data: ' + data);
          resolve(data);
        }
        //已知错误响应
        else if (code === cusResCode.ERROR) {
          console.log(url + ' error : ' + message);
          resolve(message);
        }
        //其余响应
        else {
          console.log(url + ' success msg : ' + message);
          resolve(message);
        }
      })
      .catch((error) => {
        console.log(url + ' catch : ' + error);
        reject(error);
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
  ERROR: '101',
  SUCCESS: '100',
};

export { BASE_API, promisifyHttp, cusResCode };
