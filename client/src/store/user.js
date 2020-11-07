import { getOpenid, getWCInfo } from '@util/WeChat';
import { login } from '@api/user.js';

const state = {
  WCUserInfo: {},
  //参与者0研究生1
  permission: 0,
};

const mutations = {
  set_WCUserInfo(state, WCUserInfo) {
    state.WCUserInfo = WCUserInfo;
  },
  set_permission(state, permission) {
    state.permission = permission;
  },
  reset_WCUserInfo(state) {
    state.WCUserInf = {};
  },
  reset_permission(state) {
    state.permission = null;
  },
};
/**
 * 处理getOpenid响应
 */
const actionsGetOpenid = async ({ code, data }, commit) => {
  if (code !== -1) {
    const { openid } = data;
    const { code, data } = await login({ openid });
    if (code !== -1) {
      const { permission } = data;
      commit('set_permission', permission);
      return Promise.resolve();
    } else {
      return Promise.reject(data);
    }
  }
};
/**
 * 处理getWCInfo响应
 */
const actionsGetWCInfo = async ({ code, data }, commit) => {
  if (code !== -1) {
    const { userInfo } = data;
    commit('set_WCUserInfo', userInfo);
    return Promise.resolve(userInfo);
  } else {
    return Promise.reject(data2);
  }
};
const actions = {
  /**
   * 后期捋一捋这里的逻辑
   * 登录：并发获取openid和微信用户信息，并在获取openid之后立即发送至后台判断身份
   * 先判断openid的响应因为还有一次异步请求
   * 注意：由于微信网络请求的api已经配置了失败回调，所以不需要额外包一层try catch
   */
  async login({ commit }) {
    const [res1, res2] = await Promise.all([getOpenid(), getWCInfo()]);
    actionsGetOpenid(res1, commit);
    actionsGetWCInfo(res2, commit);
  },
};

const getters = {
  /**
   * 满足其一即视作未登录
   */
  isLogin: (state) => Object.keys(state.WCUserInfo).length === 0 || state.permission === null,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};