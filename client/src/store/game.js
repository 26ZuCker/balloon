const state = {
  train_dialog: '',
  game_dialog: '',
  round1_notice: '',
  round2_notice: '',
  round3_notice: '',
};
const mutations = {
  setDialog(state, form) {
    const { train_dialog, game_dialog, round1_notice, round2_notice, round3_notice } = form;
    state.train_dialog = train_dialog;
    state.game_dialog = game_dialog;
    state.round1_notice = round1_notice;
    state.round2_notice = '第二轮提示'; //round2_notice || '';
    state.round3_notice = '第三轮提示'; //round3_notice || '';
  },
};
const actions = {};
const getters = {
  maxRound(state) {
    return 3;
    /*     if (state.round3_notice !== '') {
      return 3;
    } else if (state.round2_notice !== '') {
      return 2;
    } else {
      return 1;
    } */
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
