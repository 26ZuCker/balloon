/**
 * 获取openid
 */
const getOpenid = function() {
  // 调用云函数
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: (res) => {
        //console.log('[云函数] [login] user openid: ', res.result.openid);
        app.globalData.openid = res.result.openid;
        return resolve(res);
        /* wx.navigateTo({
          url: '../userConsole/userConsole',
        }) */
      },
      fail: (err) => {
        //console.error('[云函数] [login] 调用失败', err);
        return reject(err);
        /* wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        }) */
      },
    });
  });
};

export default getOpenid;

//获取openId
function getUserOpenId() {
  return new Promise(async (resolve, reject) => {
    Taro.login({
      success(res) {
        console.log(res);
      },
      fail(error) {
        console.log(error);
      },
    });
    /*     wx.login({
      success: function(res) {
        wx.request({
          url: config.getOpenIdPath,
          method: 'GET',
          data: {
            appId: config.appId,
            js_code: res.code,
          },
          success: function(opt) {
            const { result, data } = opt.data;
            if (result === 1) {
              store.dispatch('user/setOpenId', data.openid);
              resolve(data.openid);
            }
          },
          fail: function(error) {
            console.log(error);
          },
        });
      },
      fail: function(error) {
        console.log(error);
      },
    }); */
  });
}

export { getUserOpenId };
