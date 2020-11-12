import Vue from 'vue';
import Vuex from 'vuex';

//后续使用require.context自动引入
import user from './user';
import game from './game';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    game,
  },
});
