/**
 * 获取用户信息
 */
const getWCInfo = function() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              //console.log(res);
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
              });
              return resolve(res);
            },
            fail: (error) => {
              return reject(error);
            },
          });
        }
      },
      fail: (error) => {
        return reject(error);
      },
    });
  });
};
export default getWCInfo;
