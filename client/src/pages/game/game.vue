<template>
  <view style="height: 100%">
    <!-- 顶部通知条 -->
    <van-notify id="van-notify" />
    <!-- 顶部提示语 -->
    <van-notice-bar
      color="#1989fa"
      background="#ecf9ff"
      left-icon="info-o"
      :text="titleNotice"
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
    </view>
    <!-- 弹出层显示游戏结束 -->
    <!--     <van-dialog
      :title="titleNotice"
      :message="statisticsMsg"
      :show="isDialog"
      theme="round-button"
      :show-confirm-button="true"
      :show-cancel-button="true"
      @close="restart"
      @confirm="endGame"
      cancel-button-text="重新开始"
      confirm-button-text="提交成绩"
    >
    </van-dialog> -->
    <!-- 该组件只需要负责展示以及反馈点击了哪个按钮即可 -->
    <Dialog
      @onConfirm="confirmDialog"
      :dialogTitle="dialogTitle"
      :isDialog="isDialog"
      :waitingSecond="waitingSecond"
      :contentMsg="contentMsg"
      :confirmBtnText="confirmBtnText"
    ></Dialog>
  </view>
</template>

<script>
import { } from '@api/game'
import balloon from '@img/balloon.jpg'
import bomb from '@img/bomb.jpg'
import Dialog from '../../components/common/Dialog.vue';
import Notify from '@com/vant-weapp/dist/notify/notify.js';
import Taro from '@tarojs/taro';

//注意：与渲染无关的变量尽量不要存在data内
const optionalMode = {
  TRAIN: { title: '练习模式', tip: '当前为练习模式', btnMsg: '结束练习' },
  PERSON: { title: '为自己收账', tip: '当前为个人模式', btnMsg: '结束游戏' },
  GROUP: { title: '为队伍收账', tip: '当前为队伍模式', btnMsg: '结束游戏' }
}
const statics_template = {
  round_income: { title: '本轮收益', value: 0 },
  total_income: { title: '总收益', value: 0 },
  previous_income: { title: '上一轮收益', value: 0 },
  left_checkpoint: { title: '剩余关卡', value: 30 },
}
const colors = ['primary', 'success', 'danger', 'warning']
/**
 * 当前模式
 */
let mode = 'TRAIN'
/**
 * 最大点击次数
 */
let maxCount = 15

export default {
  inheritAttrs: false,
  name: 'game',
  components: { Dialog: Dialog },
  data: () => ({
    //点击次数
    count: 0,
    isBombing: false,
    statistics: null,
    isSubmitting: false,
    //需要传给dialog
    isDialog: false,
    waitingSecond: 20000,
    dialogTitle: '',
    //contentMsg: '',
    confirmBtnText: '',
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
      //如果进入16关则需要强制休息15s
      if (this.statistics.left_checkpoint === 15) {
        this.showDialog(15000)
      }
      if (this.statistics.left_checkpoint.value === 0) {
        this.isDialog = true
      }
    },
    /**
     * 展示对话框，timeout后才能通过点击按钮触发事件
     */
    showDialog (timeout = 20000) {
      this.isDialog = true
      this.waitingSecond = timeout
    },
    /**
     * 关闭对话框
     */
    confirmDialog () {
      this.isDialog = false
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
      return optionalMode[mode].title
    },
    /**
     * dialog内容主体
     */
    contentMsg () {
      if (mode === 'TRAIN') {
        return optionalMode[mode].tip
      } else {
        return this.statisticsMsg()
      }
    },
    /**
     * 统计信息文本化，后期需要修改即只有当结束游戏时才会进行computed否则这会一直更新缓存
     */
    statisticsMsg () {
      if (mode === 'TRAIN') {
        return '练习模式介绍'
      } else if (mode === 'PERSON') {
        return '个人模式介绍'
      }
      let res = ''
      if (this.statistics === null) { return '' }
      for (const i in this.statistics) {
        res += `${this.statistics[i].title} : ${this.statistics[i].value} \n`
      }
      return res
    },
  },
  watch: {
    mode: {
      handler (n) {
        //isDialog: false,
        //waitingSecond: 20,
        this.dialogTitle = optionalMode[mode].title
        //this.contentMsg = optionalMode[mode].tip
        this.confirmBtnText = optionalMode[mode].btnMsg
      }, immediate: true
    }
  },
  //接收参数判断当前模式是练习还是正式
  async created () {
    this.title = '当前为你自己游戏'
    this.statistics = statics_template
    //初始化先进行两轮练习
    mode = 'TRAIN'
    this.showDialog()
  },
  beforeDestroy () {

  }
}
</script>

<style lang='scss'>
@import url("./game.scss");
</style>