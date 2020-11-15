const state = {
  train_dialog: '',
  game_dialog: '',
  round1_notice: '',
  round2_notice: '',
  blast_point_list: [],
  personOnGroup: 1,
};
const mutations = {
  setDialog(state, form) {
    //console.log(form);
    const { train_dialog, game_dialog, round1_notice, round2_notice, personOnGroup } = form;
    state.train_dialog = '练习模式介绍'; //train_dialog.value;
    state.game_dialog = '正式模式介绍'; //game_dialog.value;
    state.round1_notice = '个人模式提示语'; //round1_notice.value;
    state.round2_notice = '团队模式提示语'; //round2_notice.value;
    if (personOnGroup) {
      state.personOnGroup = personOnGroup.value;
    }
  },
  setBombArr(state, blast_point_list) {
    state.blast_point_list = blast_point_list;
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
