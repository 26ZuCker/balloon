import { getOpenid, getWCInfo } from '@util/WeChat';
import { login } from '@api/user.js';
import Taro from '@tarojs/taro';

const state = {
  WCUserInfo: {},
  //参与者0研究生1
  permission: 0,
  //填写信息先存在本地
  userInfo: {
    batch: undefined,
    alipay: '',
    group: '',
    name: '',
    phone_number: '',
    school_number: '',
  },
};

const mutations = {
  /**
   * 设置角色
   * @param {any} state
   * @param {object} userInfo
   */
  setPermission(state, permission) {
    state.permission = permission;
  },
  resetPermission(state) {
    state.permission = null;
  },
  /**
   * 清空用户信息
   * @param {any} state
   * @param {object} userInfo
   */
  resetUserInfo(state) {
    state.userInfo = {
      batch: undefined,
      alipay: '',
      group: '',
      name: '',
      phone_number: '',
      school_number: '',
    };
  },
  /**
   * 存储用户填写信息在vuex
   * @param {any} state
   * @param {object} userInfo
   */
  setUserInfo(state, userInfo) {
    const res = {};
    for (const key in userInfo) {
      res[key] = userInfo[key];
    }
    state.userInfo = { ...res };
  },
  setPastRound(state, res) {
    state.set_past_round = res;
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
/**
 * 登录
 */
const onLogin = async (commit, params) =>
  new Promise((resolve, reject) => {
    Taro.cloud
      .callFunction({
        name: 'login',
        data: params,
      })
      .then((res) => {
        const { result } = res;
        const { code, message, data } = result;
        if (code === '100') {
          commit('setPermission', 1);
          const past_round = data;
          commit('setPastRound', past_round);
        } else {
          commit('setPermission', 0);
        }
        resolve(res);
      })
      .catch((error) => {
        console.log(error);
        commit('setPermission', 0);
        reject(error);
      });
  });
const actions = {
  /**
   * 后期捋一捋这里的逻辑
   * 登录：并发获取openid和微信用户信息，并在获取openid之后立即发送至后台判断身份
   * 先判断openid的响应因为还有一次异步请求
   * 注意：由于微信网络请求的api已经配置了失败回调，所以不需要额外包一层try catch
   */
  async login({ commit }, params) {
    const res = await onLogin(commit, params);
    console.log(res);
  },
};
const getters = {
  /**
   * 满足其一即视作未登录
   */
  isLogin: (state) => Object.keys(state.WCUserInfo).length === 0 || state.permission === undefined,
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
