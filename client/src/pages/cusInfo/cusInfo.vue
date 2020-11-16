<template>
  <view style="height: 100%; width: 100%">
    <!-- 顶部通知条 -->
    <van-notify id="van-notify"></van-notify>
    <!-- 顶部提示语 -->
    <van-notice-bar
      wrapable
      color="#1989fa"
      background="#ecf9ff"
      left-icon="info-o"
      style="width: 100%"
      :text="titleNotice"
    ></van-notice-bar>
    <!-- 主体 -->
    <view class="page-y-center">
      <!-- 输入框 -->
      <van-cell-group>
        <!-- 基本框 -->
        <van-field
          :value="i.value"
          @change="onInput(key, $event)"
          required
          clearable
          :label="i.title"
          :placeholder="`请输入${i.title}`"
          v-for="(i, key) in form"
          :key="i.title"
        >
        </van-field>
        <!-- 开关判断是否需要团队模式先于个人 -->
        <van-cell title="实时更新" v-if="permission === 1">
          <van-switch
            active-color="#07c160"
            :checked="is_update"
            @change="is_update = !is_update"
          ></van-switch>
        </van-cell>
        <van-cell title="个人模式优先" v-if="permission === 1">
          <van-switch
            active-color="#07c160"
            :checked="game_mode"
            @change="game_mode = !game_mode"
          ></van-switch>
        </van-cell>
      </van-cell-group>
      <view class="rca mt-3">
        <!-- 根据角色判断权限，底部交互按钮 -->
        <van-button
          custom-class="van-button--round van-button--large ma-3"
          type="primary"
          :loading="isLoading"
          @tap="submitChange"
          >{{ btnTitle }}</van-button
        >
        <!-- 研究生权限可进入信息查看页面 -->
        <van-button
          v-if="permission === 1"
          custom-class="van-button--round van-button--large ma-3"
          type="success"
          @tap="toInfo"
          >查看记录</van-button
        >
      </view>
    </view>
    <!-- 遮掩层显示二维码 -->
    <van-overlay :show="showOverlay" @click="showOverlay = false">
      <view class="page-y-center ccc">
        <image
          style="height: 350px; width: 350px; margin-bottom: 50px"
          mode="aspectFit"
          :src="QRCODE_URL"
        ></image>
        <van-icon name="close" size="40px" @tap="showOverlay = false" />
      </view>
    </van-overlay>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { mapState, mapMutations } from 'vuex'
import validate from '@util/validate'
import Notify from '@com/vant-weapp/dist/notify/notify.js';
import myQRCODE from '@img/myQRCODE.jpg';
//参与者
import { get_userInfo_template } from '@api/user.js';
//管理者
import { get_game_setting_template, submit_game_setting } from '@api/setting.js';
//预加载配置
import { get_game_settings, _update, _submit } from '@api/game';
/* import {
  onInput,
  submitChange,
  submitUserInfo,
  getUserInfoTemplate,
  validateForm,
  submitSetting,
  getGameSettingTemplate,
  getGameSetting
} from './hook/model.js' */

export default {
  inheritAttrs: false,
  name: 'cusInfo',
  components: {
  },
  data: () => ({
    form: null,
    isLoading: false,
    showOverlay: false,
    QRCODE_URL: '',
    is_update: true,
    game_mode: true
  }),
  props: {},
  methods: {
    /**
     * 监听表单输入，后期注意防抖
     */
    onInput (key, $event) {
      this.form[key].value = $event.detail;
    },
    /**
     * 校验表单输入值合法性：
     * 1.是否填写完毕
     * 2.每一块是否输入有效数值，注意即使输入number也转换为string即可
     */
    validateForm () {
      if (this.form === null) {
        return !1;
      }
      //目前只校验是否已输入
      for (const key in this.form) {
        const cur = this.form[key]
        if (Object.keys(cur.validator) !== 0
          && !validate(cur.value, cur.validator.eleType, cur.validator.validType)) {
          Notify({ type: 'danger', message: '格式填写错误' })
          return false
        }
        else {
          if (this.form[key].value.length === 0) {
            Notify({ type: 'danger', message: '你尚未填写完毕' })
            return false
          }
        }
      }
      return true
    },
    /**
     * 根据路由传参判断当前页面为配置还是个人信息填写
     */
    submitChange () {
      Notify({ type: 'warning', message: '提交中' });
      if (!this.validateForm()) {
        return;
      }
      if (this.permission === 0) {
        this.submitUserInfo();
      } else if (this.permission === 1) {
        this.submitSetting();
      }
    },
    /**
     * 提交用户信息之后再获取游戏参数
     */
    async submitUserInfo () {
      this.isLoading = !0;
      //先提交
      const params = {};
      for (const key in this.form) {

        params[key] = this.form[key].value;
      }
      this.setUserInfo(params);
      //后获取此批游戏配置
      const batch = this.form.batch.value;
      let res;
      try {
        res = await this.getGameSetting({ batch: batch });
        this.isLoading = !1;
        if (typeof res === 'string') {
          Notify({ type: 'danger', message: res });
          return
        }
      } catch (error) {
        return error;
      }
      this.setSettings(res);
      //调整视图
      Taro.navigateTo({
        url: '../game/game',
      });
    },
    /**
     * 提交更改配置
     */
    async submitSetting () {
      this.isLoading = !0;
      const params = {};
      for (const key in this.form) {
        params[key] = this.form[key].value;
      }
      params['is_update'] = this.is_update;
      params['blast_point_distribution'] = 0;
      params['game_mode'] = this.game_mode ? 0 : 1;
      try {
        await submit_game_setting(params);
      } catch (error) {
        return error;
      }
      //改变视图
      this.isLoading = !1;
      this.showOverlay = !0;
      this.QRCODE_URL = myQRCODE;
    },
    /**
     * 获取游戏配置
     */
    async getGameSetting (params) {
      try {
        return await get_game_settings(params);
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 建议进入前根据传入一个状态值判断当前用户是否已填写过该表格避免重复填写
     */
    async getUserInfoTemplate () {
      const res = await get_userInfo_template();
      return res;
    },
    /**
     * 获取游戏配置填写模板
     */
    async getGameSettingTemplate () {
      const res = await get_game_setting_template();
      return res;
    },
    /**
     * 进入历史记录页面
     */
    toInfo () {
      Taro.navigateTo({ url: '../info/info' })
    },
    ...mapMutations(
      { setSettings: 'game/setSettings', setUserInfo: 'user/setUserInfo' }
    )
  },
  computed: {
    /**
     * 输入框提示文字
     */
    placeholderTitle () {
      return function (title) {
        return `请输入${title}`
      }
    },
    /**
     * 提交按钮显示文案
     */
    btnTitle () {
      return this.permission === 0 ? '提交' : '生成游戏二维码'
    },
    /**
     * 顶部提示框
     */
    titleNotice () {
      return this.permission === 0 ? '请填写你的个人信息' : '请填写当前批次游戏的配置，随后会生成二维码'
    },
    ...mapState({
      permission: (state) => state.user.permission
    })
  },
  /**
    * 统一进入该页面
    * 建议挂载全局变量判断cusInfo是否已提交则没必要额外再发送一次login请求
    * 在进入游戏三个按钮的页面，进入前先传openid到后台，根据传回的自定义状态码判断身份
    * 获取openid和微信个人信息 -> 发送至后台判断身份
    * 研究生身份：提供数据导出和实验组批次设置两个url
    * 参与者身份：直接跳转至cusInfo，注意此时需要初始化研究生的模板存入vuex
    */
  async created () {
    const bool = this.permission === 0
    //填写的模板
    this.form = bool ? await this.getUserInfoTemplate() : await this.getGameSettingTemplate()
  }
}
</script>

<style lang='scss' >
@import url("./cusInfo.scss");
</style>