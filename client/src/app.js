import Vue from 'vue';
import Taro from '@tarojs/taro';
import store from './store/index';
//mport { getOpenid } from '@util/WeChat';

import './app.scss';

const App = new Vue({
  store,
  /**
   * 同步获取
   */
  async mounted() {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init();
    }
    /*     const res = await getOpenid();
    console.log(res); */
  },
  onShow(options) {},
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default);
  },
});

export default App;
