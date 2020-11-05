<template>
  <view class="ccc">
    <!-- 头像和名字 -->
    <!--     <image :style="imgStyle" mode="aspectFit" :src=""></image>
 -->
    <van-button type="primary" custom-class="van-button--round" @tap="toGame"
      >进入游戏</van-button
    >
    <van-button type="info" custom-class="van-button--round" @tap="toGame(0)"
      >练习一下</van-button
    >
    <!-- 配置以及导出数据 -->
    <!--     <van-icon
      name="setting"
      color="info"
      size="50px"
      @tap="toInfo"
      v-if="allowPermission"
    /> -->
    <!-- 导出按钮 -->
    <!--     <van-button type="info" custom-class="van-button--round" @tap="toInfo"
      >导出数据</van-button
    > -->
  </view>
</template>

<script>
import Taro from '@tarojs/taro'

import { login } from '@api/user.js'
import getOpenid from '@util/WeChat/getOpenid'
import getWCInfo from '@util/WeChat/getWCInfo'

export default {
  inheritAttrs: false,
  name: '',
  components: {},
  data: () => ({
    allowPermission: false
  }),
  props: {},
  methods: {
    toGame (mode = 1) {
      const modeType = ['TEST', 'FORMAL']
      Taro.navigateTo({
        url: '../game/game'
      })
      /*       Taro.navigateTo({
              url: `../game/game?mode=${modeType[mode]}`,
            }) */
    },
    toInfo () {
      Taro.navigateTo({
        url: '../info/info'
      })
    }
  },
  computed: {},
  watch: {},
  /**
   * 建议挂载全局变量判断cusInfo是否已提交则没必要额外再发送一次login请求
   * 在进入游戏三个按钮的页面，进入前先传openid到后台，根据传回的自定义状态码判断身份
   * 获取openid和微信个人信息 -> 发送至后台判断身份
   * 研究生身份：提供数据导出和实验组批次设置两个url
   * 参与者身份：直接跳转至cusInfo页面
   */
  /*   async created () {
      try {
        const { code, res } = (await login).data
        if (code !== this.$cusResCode.ERROR) {
          if (code === 1) {
            Taro.navigateTo({ url: '../cusInfo/cusInfo' })
          }
          else if (code === 2) {
            this.allowPermission = true
          }
        } else {
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      }
    }, */
  mounted () {
    this.allowPermission = true
    //Taro.navigateTo({ url: '../cusInfo/cusInfo' })
  }
}
</script>

<style lang='scss' >
page {
  height: 100%;
}
.ccc {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.van-button--round {
  margin: 20px;
  border-radius: 999px !important;
}
</style>