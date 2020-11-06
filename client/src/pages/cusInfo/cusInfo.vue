<template>
  <view class="ccc">
    <!-- 顶部通知条 -->
    <van-notify id="van-notify"></van-notify>
    <!-- 顶部提示语 -->
    <van-notice-bar
      color="#1989fa"
      background="#ecf9ff"
      left-icon="info-o"
      text="请填写"
    ></van-notice-bar>
    <van-cell-group>
      <van-field
        :value="i.value"
        required
        clearable
        :label="i.title"
        :placeholder="placeholderTitle(i.title)"
        v-for="i in form"
        :key="i.title"
      ></van-field>
    </van-cell-group>
    <van-button
      custom-class="van-button--round van-button--large ma-3"
      type="primary"
      :loading="isLoading"
      @tap="submitChange"
      >{{ btnTitle }}</van-button
    >
    <van-button
      v-if="pageType === 1"
      custom-class="van-button--round van-button--large ma-3"
      type="success"
      @tap="toInfo"
      >查看记录</van-button
    >
    <van-overlay :show="showOverlay" @click="showOverlay = false">
      <view class="cccH">
        <image
          style="height: 430px; width: 430px"
          mode="aspectFit"
          :src="QRCODE_URL"
        ></image>
        <van-icon name="close" @tap="showOverlay = false" />
      </view>
    </van-overlay>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { get_userInfo_template, submit_userInfo } from '@api/user.js'
import Notify from '@com/vant-weapp/dist/notify/notify.js';
import myQRCODE from '@img/myQRCODE.jpg'

export default {
  inheritAttrs: false,
  name: '',
  components: {
  },
  data: () => ({
    form: null,
    isLoading: false,
    pageType: 0,
    showOverlay: false,
    QRCODE_URL: ''
  }),
  props: {},
  methods: {
    /**
     * 建议进入前根据传入一个状态值判断当前用户是否已填写过该表格避免重复填写
     */
    async get_userInfo_template () {
      try {
        const { code, data } = (await get_userInfo_template()).data
        if (code !== this.cusResCode.ERROR) {
          this.userInfo = data.userInfo
          return Promise.resolve()
        } else {
          return Promise.reject('http fail')
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    /**
     * 提交用户信息
     */
    async submit_userInfo () {
      this.isLoading = true
      Taro.navigateTo({
        url: '../open/open',
      })
    },
    /**
     * 根据路由传参判断当前页面为配置还是个人信息填写
     */
    submitChange () {
      if (this.pageType === 0) {
        this.submit_userInfo()
      } else if (this.pageType === 1) {
        this.submit_setting()
      }
    },
    /**
     * 提交更改配置
     */
    async submit_setting () {
      this.isLoading = true;
      const timer = setTimeout(() => {
        this.isLoading = false
        this.showOverlay = true
        this.QRCODE_URL = myQRCODE
      })
    },
    /**
     * 进入历史记录页面
     */
    toInfo () {
      Taro.navigateTo({ url: '../info/info' })
    }
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
      return this.pageType === 0 ? '生成游戏二维码' : '提交'
    }
  },
  watch: {},
  /**
    * 统一进入该页面
    * 建议挂载全局变量判断cusInfo是否已提交则没必要额外再发送一次login请求
    * 在进入游戏三个按钮的页面，进入前先传openid到后台，根据传回的自定义状态码判断身份
    * 获取openid和微信个人信息 -> 发送至后台判断身份
    * 研究生身份：提供数据导出和实验组批次设置两个url
    * 参与者身份：直接跳转至cusInfo页面
    */
  async created () {
    Notify({ type: 'warning', message: '提交中' });
    this.form = Object.freeze()
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
.ccc {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
page {
  height: 100%;
}
.ma-3 {
  margin: 30px;
}
.cccH {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>