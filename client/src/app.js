import Vue from 'vue';
import Taro from '@tarojs/taro';
import store from './store/index';

import './app.scss';

/* //由于taro使用拦截器需要额外安装taro-axios则直接全局挂载响应码即可
import { cusResCode } from './apis/config.js';
Vue.prototype.$cusResCode = cusResCode; */

const App = new Vue({
  store,
  /**
   * 同步获取
   */
  mounted() {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init();
    }
    store.dispatch('user/login');
    /*     Taro.cloud
      .callFunction({
        name: 'downloadExcel',
        data: {},
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    Taro.cloud
      .callFunction({
        name: 'getAllBatch',
        data: {},
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    Taro.cloud
      .callFunction({
        name: 'getGameSettings',
        data: {},
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    Taro.cloud
      .callFunction({
        name: 'setup',
        data: {},
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    Taro.cloud
      .callFunction({
        name: 'submit',
        data: {},
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    Taro.cloud
      .callFunction({
        name: 'update',
        data: {},
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      }); */
  },
  onShow(options) {},
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default);
  },
});

export default App;
