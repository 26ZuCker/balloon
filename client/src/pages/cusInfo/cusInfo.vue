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
        <template>
          <van-cell title="实时更新">
            <van-switch
              active-color="#07c160"
              :checked="is_update"
              @change="is_update = !is_update"
            ></van-switch>
          </van-cell>
          <van-cell title="个人模式优先">
            <van-switch
              active-color="#07c160"
              :checked="game_mode"
              @change="game_mode = !game_mode"
            ></van-switch>
          </van-cell>
        </template>
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

import {
  onInput,
  submitChange,
  submitUserInfo,
  getUserInfoTemplate,
  validateForm,
  submitSetting,
  getGameSettingTemplate,
  getGameSetting
} from './hook/model.js'

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
    onInput () {
      onInput.call(this, ...arguments)
    },
    getUserInfoTemplate () {
      getUserInfoTemplate.call(this, ...arguments)
    },
    validateForm () {
      validateForm.call(this, ...arguments)
    },
    submitChange () {
      submitChange.call(this, ...arguments)
    },
    submit_userInfo () {
      submit_userInfo.call(this, ...arguments)
    },
    submit_setting () {
      submit_setting.call(this, ...arguments)
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
    this.form = bool ? await getUserInfoTemplate() : await getGameSettingTemplate()
  }
}
</script>

<style lang='scss' >
@import url("./cusInfo.scss");
</style>