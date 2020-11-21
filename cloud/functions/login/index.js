// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk');

// 初始化 cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();
const MAX_LIMIT = 100;
/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 *
 * event 参数包含小程序端调用传入的 data
 *
 */
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    //return wxContext.OPENID
    if (
      wxContext.OPENID === 'ospJc5Kdv7Rbh592uFMhDQE1T6xs' ||
      wxContext.OPENID === 'ospJc5I-nTU3cTLJwh6M85eFxY8E'
    ) {
      //获取所有的数据
      const countResult = await db.collection('settings').count();
      const total = countResult.total;

      const batchTimes = Math.ceil(total / 100);

      const tasks = [];
      for (let i = 0; i < batchTimes; i++) {
        const promise = db
          .collection('settings')
          .skip(i * MAX_LIMIT)
          .limit(MAX_LIMIT)
          .get();
        tasks.push(promise);
      }
      // 等待所有
      let data = (await Promise.all(tasks)).reduce((acc, cur) => {
        return {
          data: acc.data.concat(cur.data),
          errMsg: acc.errMsg,
        };
      }).data;

      let used_list = Array();
      data.forEach((v) => {
        used_list.push(v.batch);
      });

      return {
        code: '100',
        message: 'success',
        data: used_list,
      };
    } else {
      return {
        code: '102',
        message: 'Authentication failed',
      };
    }
  } catch (e) {
    return {
      code: '101',
      message: e,
    };
  }
};
