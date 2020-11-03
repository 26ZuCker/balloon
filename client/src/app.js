import Vue from 'vue';
import Taro from '@tarojs/taro';

import './app.scss';
//import { getOpenId, getUserInfo } from './utils/WeChat';

const App = new Vue({
  async mounted() {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init();
    }
    //await Promise.all([getOpenId(), getUserInfo()]);
  },
  onShow(options) {},
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default);
  },
});

export default App;
