<template>
  <view>
    <!-- 顶部提示语 -->
    <view class="ccc">{{ title }}</view>
    <!-- 气球主体，建议限制高度为百分比 -->
    <view class="img-container">
      <image
        :style="imgStyle"
        mode="aspectFit"
        v-if="isBombing"
        :src="bomb"
      ></image
      ><image :style="imgStyle" mode="aspectFit" v-else :src="balloon"></image>
    </view>
    <!-- 状态单元格 -->
    <van-cell-group>
      <van-cell
        class="statistic_main"
        v-for="i in statistic_data"
        :key="i.title"
        :title="i.title"
        :value="i.value"
      ></van-cell>
    </van-cell-group>

    <!-- 按钮组 -->
    <view class="rac">
      <van-button
        custom-class="van-button--round van-button--large"
        type="primary"
        @tap="blow"
        >{{ isBombing ? "下一轮" : "充气" }}</van-button
      >
      <van-button
        custom-class="van-button--round van-button--large"
        type="info"
        @tap="accountReceive"
        >收账</van-button
      >
    </view>
  </view>
</template>

<script>
import { } from '@/apis/game'
import balloon from '@/img/balloon.svg'
import bomb from '@/img/bomb.svg'

//注意：与渲染无关的变量尽量不要存在data内
let totalCheckpoint = 30
let mode = ''
let maxCount = 3//Number.MAX_SAFE_INTEGER
/* const timerTar = {
  timer: null,
  isBombing: false
}
 */
export default {
  inheritAttrs: false,
  name: 'game',
  components: {},
  data: () => ({
    //标题
    title: '当前为你自己游戏',
    //气球图片
    /*     balloon_src: balloon,
        bomb_src: bomb, */
    //点击次数
    count: 0,
    isBombing: false,
    statistic_data: {
      round_income: { title: '本轮收益', value: 0 },
      total_income: { title: '总收益', value: 0 },
      previous_income: { title: '上一轮收益', value: 0 },
      left_checkpoint: { title: '剩余关卡', value: 0 },
    }
  }),
  methods: {
    /**
     * 打气
     */
    blow () {
      if (this.count < maxCount) {
        this.count += 1
        if (this.count === maxCount) {
          this.isBombing = true
          this.accountReceive()
        }
      } else {
        this.isBombing = false
      }
    },
    /**
     * 收账
     */
    accountReceive () {
      this.count = 0
      //this.isBombing = false
    }
  },
  computed: {
    balloon () { return balloon },
    bomb () { return bomb },
    imgStyle () {
      const width = this.count * 8 + 100
      const height = this.count * 5 + 100
      return `width: ${width}px; height: ${height}px`
    },
  },
  watch: {},
  //接收参数判断当前模式是练习还是正式
  async created () {
    //this.leftCheckpoint = mode === 'FORMAL' ? 30 : 2
    /*     this.$on('beforeDestroy', () => {
          clearTimeout(timerTar.timer)
        }) */
  }
}
</script>

<style lang='scss'>
page {
  height: 100%;
  width: 100%;
}
.ccc {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.rac {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-around;
}
.img-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 600px;
  width: 100%;
  //border: 1px solid black;
}
.van-button--round {
  border-radius: 999px !important;
}
.van-button--large {
  width: 100px !important;
  height: 50px !important;
  margin: 10px 30px 10px 30px;
}
.statistic_main {
  width: 100%;
  border: 1px solid black;
}
</style>