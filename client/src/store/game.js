/**
 * 保存两种，二者区别在于，在提交游戏数据时，前者不需要作为参数传递
 * 游戏配置
 * 本次游戏用户所填信息
 */
const state = {
  //游戏配置
  viewSettings: {
    practice_tips: '',
    game_tips: '',
    round_tips: {
      team: '',
      personal: '',
    },
    game_mode: 0,
    blast_point_distribution: 0,
    is_update: true,
    money: Number.MIN_SAFE_INTEGER,
    blast_point: {
      team: [],
      personal: [],
    },
  },
  //提交配置
  submitSettings: {
    group: Number.MAX_SAFE_INTEGER,
    batch: Number.MAX_SAFE_INTEGER,
    end_time: Number.MAX_SAFE_INTEGER,
  },
};
const mutations = {
  setSettings(state, res) {
    for (const key in res) {
      if (key === 'batch' || key === 'end_time' || key === 'group') {
        state.submitSettings[key] = res[key];
      } else {
        state.viewSettings[key] = res[key];
      }
    }
    state.viewSettings.blast_point['TRAIN'] = [15, 15];
  },
  setPastRound(state, res) {
    state.set_past_round = res;
  },
};
const actions = {};
const getters = {
  isOk(state) {
    return state.viewSettings.practice_tips !== '';
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
