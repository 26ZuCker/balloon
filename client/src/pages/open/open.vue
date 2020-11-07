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

export default {
  inheritAttrs: false,
  name: 'open',
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