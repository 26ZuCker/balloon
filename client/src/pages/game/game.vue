<template>
  <view style="height: 100%">
    <!-- 顶部通知条 -->
    <van-notify id="van-notify" />
    <!-- 顶部提示语 -->
    <van-notice-bar
      color="#1989fa"
      background="#ecf9ff"
      left-icon="info-o"
      :text="title"
    ></van-notice-bar>
    <!--     <view class="ccc">{{ title }}</view>-->
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
        class="statistic-main"
        v-for="i in statistics"
        :key="i.title"
        :title="i.title"
        :value="i.value"
      ></van-cell>
      <!--       <van-cell v-for="(v, i) in statistics" :key="v.title">
        <slot-view name="title">
          <van-tag round :type="colors[i % 4]">{{ i.title }}</van-tag>
        </slot-view>
        {{ i.value }}
      </van-cell> -->
    </van-cell-group>

    <!-- 按钮组 -->
    <view class="rac">
      <template v-if="statistics.left_checkpoint !== 0">
        <van-button
          custom-class="van-button--round van-button--large"
          :type="isBombing ? 'warning' : 'primary'"
          @tap="blow"
          >{{ isBombing ? "下一轮" : "充气" }}</van-button
        >
        <van-button
          custom-class="van-button--round van-button--large"
          type="info"
          @tap="accountReceive"
          >收账</van-button
        >
      </template>
      <van-button
        v-else
        custom-class="van-button--round van-button--large"
        type="info"
        @tap="endGame"
        :loading="isSubmitting"
        >结束游戏</van-button
      >
    </view>
    <!-- 弹出层显示游戏结束 -->
    <van-dialog
      title="游戏结束"
      :message="statisticsMsg"
      :show="showDialog"
      theme="round-button"
      show-cancel-button
      @close="restart"
      @confirm="endGame"
      cancel-button-text="重新开始"
      confirm-button-text="提交成绩"
    >
    </van-dialog>
  </view>
</template>

<script>
import { } from '@api/game'
import balloon from '@img/balloon.jpg'
import bomb from '@img/bomb.jpg'
//import Dialog from '@com/vant-weapp/dist/dialog/dialog.js';
import Notify from '@com/vant-weapp/dist/notify/notify.js';
import taro from '@tarojs/taro';

//注意：与渲染无关的变量尽量不要存在data内
//当前是练习，为自己或为小组即TRAIN，PERSON,GROUP
const optionalMode = {
  TRAIN: '练习模式', PERSON: '为自己收账', GROUP: '为队伍收账'
}
let mode = optionalMode['PERSON']
//最大点击次数
let maxCount = 15
/* const timerTar = {
  timer: null,
  isBombing: false
}
 */
const statics_template = {
  round_income: { title: '本轮收益', value: 0 },
  total_income: { title: '总收益', value: 0 },
  previous_income: { title: '上一轮收益', value: 0 },
  left_checkpoint: { title: '剩余关卡', value: 30 },
}
//可选颜色
const colors = ['primary', 'success', 'danger', 'warning']
export default {
  inheritAttrs: false,
  name: 'game',
  components: {},
  data: () => ({
    //点击次数
    count: 0,
    isBombing: false,
    statistics: null,
    isSubmitting: false,
    showDialog: false
  }),
  methods: {
    /**
     * 打气
     */
    blow () {
      if (this.count < maxCount) {
        this.count += 1
        this.statistics.round_income.value = this.count
        if (this.count === maxCount) {
          this.isBombing = true
          Notify({ type: 'warning', message: '爆炸' });
        }
      } else {
        this.accountReceive()
      }
    },
    /**
     * 收账
     */
    accountReceive () {
      let previous_income = this.count
      if (this.isBombing) {
        previous_income = 0
      }
      //需要统计数据
      this.takeStatistics(previous_income)
      //当前清零
      this.count = 0
      //视图改变
      this.isBombing = false
      //this.isBombing = false
    },
    /**
     * 结束游戏
     */
    async endGame () {
      this.isSubmitting = true
      Taro.navigateTo({ url: '../open/open' })
    },
    /**
     * 统计和收集每一轮所需的数据
     */
    takeStatistics (previous_income = 0) {
      this.statistics.previous_income.value = previous_income
      this.statistics.round_income.value = 0
      this.statistics.total_income.value += this.statistics.previous_income.value
      this.statistics.left_checkpoint.value -= 1
      if (this.statistics.left_checkpoint.value === 0) {
        this.showDialog = true
      }
    },
    /**
     * 重新开始当前该用户当前批次的游戏
     */
    restart () {
      this.count = 0
      this.statistics = statics_template
    }
  },
  computed: {
    balloon () { return balloon },
    bomb () { return bomb },
    /**
     * 图片大小改变
     */
    imgStyle () {
      const width = this.count * 8 + 100
      const height = this.count * 5 + 100
      return `width: ${width}px; height: ${height}px`
    },
    /**
     * 顶部标题
     */
    titleNotice () {
      return optionalMode[mode]
    },
    /**
     * 统计信息文本化，后期需要修改即只有当结束游戏时才会进行computed否则这会一直更新缓存
     */
    statisticsMsg () {
      let res = ''
      if (this.statistics === null) { return '' }
      for (const i in this.statistics) {
        res += `${this.statistics[i].title} : ${this.statistics[i].value} \n`
      }
      return res
    }
  },
  watch: {},
  //接收参数判断当前模式是练习还是正式
  async created () {
    this.title = '当前为你自己游戏'
    this.statistics = statics_template
    //this.leftCheckpoint = mode === 'TRAIN' ? 2 : 30
    /*     this.$on('beforeDestroy', () => {
          clearTimeout(timerTar.timer)
        }) */
  },
  beforeDestroy () {

  }
}
</script>

<style lang='scss'>
@import url("./game.scss");
</style>