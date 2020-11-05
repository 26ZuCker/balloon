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
    <van-icon name="setting" color="info" size="50px" @tap="toInfo" />
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
  name: '',
  components: {},
  data: () => ({

  }),
  props: {},
  methods: {
    toGame (mode = 1) {
      const modeType = ['TEST', 'FORMAL']
      Taro.navigateTo({
        url: '../game/game'
      })
      Taro.navigateTo({
        url: `../game/game?mode=${modeType[mode]}`,
        /*         events: {
                  // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                  acceptDataFromOpenedPage: function (data) {
                    console.log(data)
                  },
                  someEvent: function (data) {
                    console.log(data)
                  }
                },
                success: function (res) {
                  // 通过eventChannel向被打开页面传送数据
                  res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
                } */
      })
    },
    toInfo () {
      Taro.navigateTo({
        url: '../info/info'
      })
    }
  },
  computed: {},
  watch: {},
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