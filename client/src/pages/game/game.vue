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
    <!-- 该组件只需要负责展示以及反馈点击了哪个按钮即可 -->
    <Dialog
      @onConfirm="confirmDialog"
      :isDialog="isDialog"
      :waitingSecond="waitingSecond"
      :contentMsg="contentMsg"
      :confirmBtnText="confirmBtnText"
      :current_mode="current_mode"
    ></Dialog>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';
//api
import { } from '@api/game'
//图片
import balloon from '@img/balloon.jpg'
import bomb from '@img/bomb.jpg'
//组件
import Dialog from '@com/common/Dialog.vue';
import Notify from '@com/vant-weapp/dist/notify/notify.js';

//注意：与渲染无关的变量尽量不要存在data内
const optionalMode = {
  TRAIN: { title: '练习模式', tip: '当前为练习模式\n当前为练习模式\n当前为练习模式\n当前为练习模式\n当前为练习模式\n当前为练习模式\n', btnMsg: '确认' },
  PERSON: { title: '为自己收账', tip: '当前为个人模式\n当前为个人模式\n当前为个人模式\n当前为个人模式\n当前为个人模式\n当前为个人模式\n', btnMsg: '确认' },
  GROUP: { title: '为队伍收账', tip: '当前为队伍模式\n', btnMsg: '确认' },
  OVER: { title: '为队伍收账', tip: '当前为队伍模式', btnMsg: '确认' },
}
/**
 * 统计信息模板
 */
const statics_template = {
  round_income: { title: '本轮收益', value: 0 },
  total_income: { title: '总收益', value: 0 },
  previous_income: { title: '上一轮收益', value: 0 },
  left_checkpoint: { title: '剩余关卡', value: 30 },
}
/**
 * 当前模式
 */
let mode = ''
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
    //与视图变化有关的数据
    isBombing: false,
    isSubmitting: false,
    isDialog: false,
    waitingSecond: 20000,
    //需要传给子组件的props
    contentMsg: '',
    confirmBtnText: '',
    //所需收集的数据
    statistics: null,
  }),
  methods: {
    /**
     * 打气
     */
    blow () {
      //未达到爆炸点前点击
      if (this.count < maxCount) {
        this.count += 1
        this.statistics.round_income.value = this.count
        //这次点击达到爆炸点
        if (this.count === maxCount) {
          this.isBombing = true
          Notify({ type: 'warning', message: '爆炸' });
        }
      }
      //再点击一次则统计本轮收益
      else {
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
    },
    /**
     * 响应dialog的结束游戏按钮
     */
    async endGame () {
      if (mode === 'TRAIN') {
        this.changeMode()
      } else {
        this.changeMode()
        this.isSubmitting = true
        Taro.navigateTo({ url: '../open/open' })
      }
    },
    /**
     * 改变模式，只能单向不可逆：TRAIN -> PERSON -> GROUP
     * 需要更改模式只有三种情况：初始化，每一轮游戏结束后
     */
    changeMode () {
      //练习模式之前
      if (mode === '') {
        mode = 'TRAIN'
        statics_template.left_checkpoint.value = 2
        this.changeProps()
      }
      //练习模式之后，正式模式之前，注意这里由于dialog关闭存在动画即非即时关闭所以只能设置一个定时器进行数据更新
      else if (mode === 'TRAIN') {
        mode = 'PERSON'
        statics_template.left_checkpoint.value = 30
        this.restart()
        const that = this
        //以下逻辑有待斟酌
        const timer = setTimeout(() => {
          that.changeProps()
        }, 3000)
        this.$on('beforeDestroy', () => {
          clearTimeout(timer)
        })
      }
      //正式模式30关结束后，包括团队此时需要回调
      else if (mode === 'PERSON' || mode === 'GROUP') {
        console.log('else if')
        mode = 'OVER'
        this.showDialog()
        //this.restart()
      }
      //所有模式结束，直接离开
      else if (mode === 'OVER') {
        this.showDialog()
        console.log('else')
        //Taro.navigateTo({ url: '../open/open' })
      }
    },
    /**
     * 改变传给dialog的props
     */
    changeProps (contentMsg = '', confirmBtnText = '') {
      if (contentMsg !== '') {
        this.contentMsg = contentMsg
      } else {
        this.confirmBtnText = optionalMode[mode].btnMsg
      }
      if (confirmBtnText !== '') {
        this.confirmBtnText = confirmBtnText
      }
      //只要非练习模式，点击结束按钮都会展示该轮比赛成绩
      else {
        this.contentMsg = mode === 'TRAIN' ? optionalMode[mode].tip : this.statisticsMsg()
      }
    },
    /**
     * 派发收账按钮的回调，统计和收集每一轮所需的数据
     */
    takeStatistics (previous_income = 0) {
      this.statistics.previous_income.value = previous_income
      this.statistics.round_income.value = 0
      this.statistics.total_income.value += this.statistics.previous_income.value
      this.statistics.left_checkpoint.value -= 1
      //如果当前为练习模式则展示即初始化
      if (mode === 'TRAIN' && this.statistics.left_checkpoint.value === 0) {
        this.changeMode()
        this.showDialog()
        return
      }
      //如果进入16关则需要强制休息15s
      if (this.statistics.left_checkpoint.value === 15) {
        this.showDialog(15000, '休息一下', '继续游戏')
      }
      //正式模式及团队模式30关全部结束
      if (this.statistics.left_checkpoint.value === 0) {
        //this.changeMode()
        //此处不需要等待，但需要展示按钮进行提交选项
        this.showDialog(0)
      }
    },
    /**
     * 展示对话框，timeout后才能通过点击按钮触发事件，具体参数通过prop响应式传递给组件
     */
    showDialog (timeout = 20000, contentMsg = '', confirmBtnText = '') {
      this.isDialog = true
      this.waitingSecond = timeout
      this.changeProps(contentMsg, confirmBtnText)
    },
    /**
     * 监听对话框传的点击确认按钮事件
     * 回调包括：可能改变模式，改变传入的文案
     */
    confirmDialog () {
      /**
       * 以下情况派发按钮的回调不需要改变当前模式
       * 1.练习模式之前，此时在生命周期内进行初始化的changeMode即可
       * 2.15关之后的等待
       * 3.练习模式之后先改变，但是点击时不能进行改变
       * 如果在正式模式后进行点击，需要进行loading处理
       */
      if (mode !== 'TRAIN' && this.statistics.left_checkpoint.value !== 15) {
        this.changeMode()
      }
      //练习模式点击只关闭dialog
      this.isDialog = false
    },
    /**
     * 重新开始当前该用户当前批次的游戏，清空整个统计数据，不改变模式
     */
    restart () {
      this.count = 0
      this.statistics = statics_template
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
      return this.statistics
      /*       let res = ''
            if (this.statistics === null) { return '' }
            for (const i in this.statistics) {
              res += `${this.statistics[i].title} : ${this.statistics[i].value}`
              res += '\r\n'
            }
            return res */
    },
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
      return mode === '' ? '' : optionalMode[mode].title
    },
    /**
     * 用于传递prop
     */
    current_mode () {
      console.log(mode)
      return mode
    }
  },
  async created () {
    this.statistics = statics_template
    this.changeMode()
    //初始化先进行两轮练习
    this.showDialog()
  },
  beforeDestroy () {

  }
}
</script>

<style lang='scss'>
@import url("./game.scss");
</style>