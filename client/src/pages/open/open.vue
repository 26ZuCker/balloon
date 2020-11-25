<template>
  <view style="height: 100%; width: 100%">
    <!-- 顶部通知条 -->
    <van-notify id="van-notify" />
    <!-- 骨架屏等待 -->
    <van-skeleton v-if="isSkeleton" title row="30"></van-skeleton>
    <!-- 填写密码 -->
    <view
      v-if="!isSkeleton && permission === 0"
      class="ccc"
      style="height: 100%; width: 100%"
    >
      <van-divider
        contentPosition="center"
        customStyle="color: #07c160; border-color: #07c160; font-size: 18px;"
      >
        请输入密码进入管理模式
      </van-divider>
      <input
        :password="true"
        :focus="true"
        type="text"
        placeholder="请输入管理员密码"
        :value="password"
        @input="onInput($event)"
      />
      <van-button
        custom-class="van-button--round van-button--large ma-3"
        type="primary"
        :loading="isLoading"
        @tap="submitOpen"
        >校验密码</van-button
      >
    </view>
    <!-- 填写表单 -->
    <Setting v-if="permission === 1" @onShowOR="showOR"></Setting>
    <!-- 遮掩层显示二维码 -->
    <van-overlay :show="showOverlay" z-index="5">
      <view class="page-y-center ccc">
        <image
          style="height: 350px; width: 350px; margin-bottom: 50px"
          mode="aspectFit"
          :src="QRCODE_URL"
        ></image>
        <van-icon
          name="close"
          @tap="showOverlay = false"
          color="success"
          size="40px"
        />
      </view>
    </van-overlay>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import Notify from '@com/vant-weapp/dist/notify/notify.js';
import { mapActions, mapState } from 'vuex'
import myQRCODE from '@img/QRcode.jpg';

export default {
  data: () => ({
    isShowField: true,
    password: '',
    isLoading: false,
    isSkeleton: true,
    showOverlay: false,
    QRCODE_URL: '',
  }),
  name: 'open',
  components: {
    Setting: () => import('@com/open/Setting.vue'),
  },
  methods: {
    /**
     * 监听表单输入，后期注意防抖
     */
    onInput ($event) {
      this.password = $event.detail.value;
    },
    /**
     * 发送请求至云服务器校验密码
     */
    async submitOpen () {
      this.isLoading = true
      await this.login({ password: this.password })
      if (this.permission === 0) {
        Notify({ type: 'danger', message: '密码输入错误' });
      } else if (this.permission === 1) {
        Notify({ type: 'success', message: '欢迎你，管理员' });
      }
      this.isLoading = false
    },
    /**
     * 展示二维码
     */
    showOR () {
      this.showOverlay = !0;
      this.QRCODE_URL = myQRCODE;
    },
    ...mapActions({
      login: 'user/login'
    })
  },
  computed: {
    ...mapState({
      permission: (state) => state.user.permission
    })
  },
  mounted () {
    this.isSkeleton = false
  }
}
</script>

<style lang="scss">
@import url("./open.scss");
</style>