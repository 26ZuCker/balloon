import { getOpenid, getWCInfo } from '@util/WeChat';
import { login } from '@api/user.js';

const state = {
  WCUserInfo: {},
  permission: null,
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

const actions = {
  /**
   * 后期捋一捋这里的逻辑
   * 登录：并发获取openid和微信用户信息，并在获取openid之后立即发送至后台判断身份
   * 先判断openid的响应因为还有一次异步请求
   */
  async login({ commit }) {
    try {
      const [res1, res2] = await Promise.all([getOpenid(), getWCInfo()]);
      const { code: code1, data: data1 } = res1;
      if (code1 !== -1) {
        try {
          const { openid } = data1;
          const { code, data } = await login({ openid });
          if (code !== -1) {
            const { permission } = data;
            commit('set_permission', permission);
            return Promise.resolve();
          } else {
            return Promise.reject(data);
          }
        } catch (error) {
          return Promise.reject(error);
        }
      }
      const { code: code2, data: data2 } = res2;
      if (code2 !== -1) {
        const { userInfo } = data2;
        commit('set_WCUserInfo', userInfo);
        return Promise.resolve(userInfo);
      } else {
        return Promise.reject(data2);
      }
    } catch (error) {
      return Promise.reject(error);
    }
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
