const state = {
  train_dialog: '',
  game_dialog: '',
  round1_notice: '',
  round2_notice: '',
  bomb_arr: [],
  personOnGroup: true,
};
const mutations = {
  setDialog(state, form) {
    const { train_dialog, game_dialog, round1_notice, round2_notice, personOnGroup } = form;
    state.train_dialog = train_dialog.value;
    state.game_dialog = game_dialog.value;
    state.round1_notice = round1_notice.value;
    state.round2_notice = round2_notice.value;
    state.personOnGroup = personOnGroup.value;
  },
  setBombArr(state, bomb_arr) {
    state.bomb_arr = bomb_arr;
  },
};
const actions = {};
const getters = {};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
