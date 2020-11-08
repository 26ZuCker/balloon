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
    <view class="page-y-center">
      <van-cell-group>
        <van-field
          :value="i.value"
          @change="onInput(key, $event)"
          required
          clearable
          :label="i.title"
          :placeholder="placeholderTitle(i.title)"
          v-for="(i, key) in form"
          :key="i.title"
        ></van-field>
      </van-cell-group>
      <view class="rca mt-3">
        <!-- 根据角色判断权限 -->
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
import { get_userInfo_template, submit_userInfo } from '@api/user.js'
import { get_game_setting_template, submit_game_setting } from '@api/gameSetting.js'
import Notify from '@com/vant-weapp/dist/notify/notify.js';
import myQRCODE from '@img/myQRCODE.jpg'
import { mapState } from 'vuex'

export default {
  inheritAttrs: false,
  name: 'cusInfo',
  components: {
  },
  data: () => ({
    form: null,
    isLoading: false,
    showOverlay: false,
    QRCODE_URL: ''
  }),
  props: {},
  methods: {
    /**
     * 监听表单输入，后期注意防抖
     */
    onInput (key, $event) {
      this.form[key].value = $event.detail
    },
    /**
    * 根据路由传参判断当前页面为配置还是个人信息填写
    */
    submitChange () {
      Notify({ type: 'warning', message: '提交中' });
      if (!this.validateForm()) {
        Notify({ type: 'danger', message: '你尚未填写完毕' });
        return
      }
      if (this.permission === 0) {
        this.submit_userInfo()
      } else if (this.permission === 1) {
        this.submit_setting()
      }
    },
    /**
    * 校验表单输入值合法性：
    * 1.是否填写完毕
    * 2.每一块是否输入有效数值，注意即使输入number也转换为string即可
    */
    validateForm () {
      if (this.form === null) {
        return false
      }
      //目前只校验是否已输入
      for (const i in this.form) {
        if (this.form[i].value.length === 0) {
          return false
        }
      }
      return true
    },
    /**
     * 建议进入前根据传入一个状态值判断当前用户是否已填写过该表格避免重复填写
     */
    async get_userInfo_template () {
      const { code, data } = (await get_userInfo_template()).data
      if (code !== this.cusResCode.ERROR) {
        this.userInfo = data.userInfo
        return Promise.resolve()
      } else {
        return Promise.reject('http fail')
      }
    },
    /**
     * 提交用户信息
     */
    async submit_userInfo () {
      this.isLoading = true
      //记得清除
      const timer = setTimeout(() => {
        this.isLoading = false
        Taro.navigateTo({
          url: '../open/open',
        })
      }, 1000)
    },
    /**
     * 提交更改配置
     */
    async submit_setting () {
      this.isLoading = true;
      //记得清除
      const timer = setTimeout(() => {
        this.isLoading = false
        this.showOverlay = true
        this.QRCODE_URL = myQRCODE
      }, 1000)
    },
    /**
     * 进入历史记录页面
     */
    toInfo () {
      Taro.navigateTo({ url: '../info/info' })
    },
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
    * 参与者身份：直接跳转至cusInfo页面
    */
  async created () {
    const template = this.permission === 0 ? await get_userInfo_template() : await get_game_setting_template()
    this.form = Object.freeze(template)
  }
}
</script>

<style lang='scss' >
.van-button--round {
  border-radius: 999px !important;
}
.van-button--large {
  width: 130px !important;
  height: 50px !important;
}
.rcc {
  @include md(column, center);
}
.ccc {
  @include md(column, center);
}
.rca {
  @include md(row, space-around);
}
page {
  height: 100%;
}

.page-y-center {
  position: relative;
  top: 30%;
  transform: translateY(-30%);
}
.mt-3 {
  margin-top: 30px;
}
.mt-5 {
  margin-top: 50px;
}
</style>