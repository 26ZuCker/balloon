import Vue from 'vue';
import Taro from '@tarojs/taro';
import store from './store/index';

import './app.scss';

//由于taro使用拦截器需要额外安装taro-axios则直接全局挂载响应码即可
import { cusResCode } from './apis/apiConfig.js';
Vue.prototype.$cusResCode = cusResCode;

const App = new Vue({
  store,
  async mounted() {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init();
    }
    //await store.dispatch('user/login');
  },
  onShow(options) {},
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default);
  },
});

export default App;
