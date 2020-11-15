const state = {
  practice_tips: '',
  game_tips: '',
  round_tips: {},
  blast_point_list: [],
  personOnGroup: 0,
  round: Number.MAX_SAFE_INTEGER,
  batch: Number.MAX_SAFE_INTEGER,
  blast_type: 0,
  end_time: Number.MAX_SAFE_INTEGER,
};
const mutations = {
  setSettings(state, res) {
    console.log(res);
    const {
      practice_tips,
      game_tips,
      personOnGroup,
      round_tips,
      blast_point_list,
      round,
      batch,
      blast_type,
      end_time,
    } = res;
    state.practice_tips = practice_tips;
    state.game_tips = game_tips;
    state.personOnGroup = personOnGroup;
    state.blast_point_list = blast_point_list;
    state.batch = batch;
    state.round = round;
    state.round_tips = round_tips;
    state.blast_type = blast_type;
    state.end_time = end_time;
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
