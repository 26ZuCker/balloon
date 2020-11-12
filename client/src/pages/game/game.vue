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
      :showBtn="showBtn"
    ></Dialog>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';
import { mapState, mapGetters } from 'vuex'
//图片
import balloon from '@img/balloon.jpg'
import bomb from '@img/bomb.jpg'
//组件
import Dialog from '@com/common/Dialog.vue';
import Notify from '@com/vant-weapp/dist/notify/notify.js';

//注意：与渲染无关的变量尽量不要存在data内
/**
 * 并非所有都需要渲染，后续需要重整结构
 * title顶部标题语
 * tip弹出框提示语
 */
const optionalMode = {
  TRAIN: { title: '练习模式', tip: '当前为练习模式', btnMsg: '确认' },
  ROUND1: { title: '', tip: '', btnMsg: '确认' },
  ROUND2: { title: '', tip: '', btnMsg: '确认' },
  ROUND3: { title: '', tip: '', btnMsg: '确认' },
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
    isBombing: !1,
    isSubmitting: !1,
    isDialog: !1,
    waitingSecond: 2000,
    //需要传给子组件的props
    contentMsg: '',
    confirmBtnText: '',
    //所需收集的数据
    statistics: null,
    showBtn: !0
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
          this.isBombing = !0
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
     * 改变模式，只能单向不可逆
     */
    changeMode () {
      //练习模式之前
      if (mode === '') {
        console.log('1')
        mode = 'TRAIN'
        statics_template.left_checkpoint.value = 2
        this.changeProps()
      }
      //练习模式之后，正式模式之前，注意这里由于dialog关闭存在动画即非即时关闭所以只能设置一个定时器进行数据更新
      else if (mode === 'TRAIN') {
        console.log('2')
        mode = 'ROUND1'
        statics_template.left_checkpoint.value = 30
        this.restart()
        this.changeProps()
      }
      //正式模式30关结束后，包括团队此时需要回调
      else if (mode === 'ROUND1') {
        console.log('3')
        if (this.maxRound === 1) {
          mode = 'OVER'
        } else {
          console.log('ROUND2')
          mode = 'ROUND2'
          this.restart()
          this.changeProps()
        }
      }
      else if (mode === 'ROUND2') {
        console.log('4')
        if (this.maxRound === 2) {
          mode = 'OVER'
        } else {
          console.log('ROUND3')
          mode = 'ROUND3'
          this.restart()
          this.changeProps()
        }
      }
      else if (mode === 'ROUND3') {
        console.log('5')
        mode = 'OVER'
        this.restart()
        this.changeProps()
      }
      //所有模式结束，直接离开
      else if (mode === 'OVER') {
        console.log('6')
        this.changeProps('', '', false)
        this.showDialog(0)
      }
    },
    /**
     * 改变传给dialog的props
     */
    changeProps (contentMsg = [''], confirmBtnText = '', showBtn = !0) {
      //只要非练习模式，点击结束按钮都会展示该轮比赛成绩
      this.contentMsg = contentMsg[0] === '' ? this.statisticsMsg() : contentMsg
      this.confirmBtnText = confirmBtnText === '' ? optionalMode[mode].btnMsg : confirmBtnText
      if (!showBtn) {
        this.showBtn = showBtn
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
        this.showDialog(1500, ['休息一下'], '继续游戏')
      }
      //正式模式及团队模式30关全部结束
      if (this.statistics.left_checkpoint.value === 0) {
        this.changeMode()
        if (mode === 'OVER') {
          //此处不需要等待，但需要展示按钮进行提交选项
          this.showDialog(0, [''], '', false)
        }
      }
    },
    /**
     * 展示对话框，timeout后才能通过点击按钮触发事件，具体参数通过prop响应式传递给组件
     */
    showDialog (timeout = 2000, contentMsg = [''], confirmBtnText = '', showBtn = !0) {
      this.isDialog = !0
      this.waitingSecond = timeout
      this.changeProps(contentMsg, confirmBtnText, showBtn)
    },
    /**
     * 监听对话框传的点击确认按钮事件
     * 回调包括：可能改变模式，改变传入的文案
     */
    confirmDialog () {
      /**
       * 以下情况派发按钮的回调不需要改变当前模式，有两次点击时不能更改模式的
       * 1.练习模式之前，此时在生命周期内进行初始化的changeMode即可
       * 2.15关之后的等待
       * 3.练习模式之后先改变，但是点击时不能进行改变
       * 如果在正式模式后进行点击，需要进行loading处理
       */
      /*       if (mode !== 'TRAIN' && this.statistics.left_checkpoint.value !== 15) {
              //正式游戏之前再点击确认一遍，此时只需要关闭即可
              this.changeMode()
            } */
      //练习模式点击只关闭dialog
      this.isDialog = false
    },
    /**
     * 重新开始当前该用户当前批次的游戏，不必清空整个统计数据而只重置剩余关卡，不改变模式
     */
    restart () {
      this.count = 0
      //this.statistics = statics_template
      this.statistics.left_checkpoint.value = 30
    },
    /**
     * 统计信息文本化，后期需要修改即只有当结束游戏时才会进行computed否则这会一直更新缓存
     */
    statisticsMsg () {
      if (mode === 'TRAIN') {
        return [`${this.train_dialog}`]
      } else if (mode === 'ROUND1') {
        return [`${this.game_dialog}`]
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
    iniOptionalMode () {
      optionalMode.TRAIN.tip = this.train_dialog
      optionalMode.ROUND1.tip = this.game_dialog
      optionalMode.ROUND1.title = this.round1_notice
      optionalMode.ROUND2.title = this.round2_notice
      optionalMode.ROUND3.title = this.round3_notice
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
      return mode === '' ? '' : optionalMode[mode].title
    },
    ...mapState({
      train_dialog: (state) => state.game.train_dialog,
      game_dialog: (state) => state.game.game_dialog,
      round1_notice: (state) => state.game.round1_notice,
      round2_notice: (state) => state.game.round2_notice,
      round3_notice: (state) => state.game.round3_notice,
    }),
    ...mapGetters({
      maxRound: 'game/maxRound'
    })
  },
  async created () {
    this.statistics = statics_template
    this.changeMode()
    //初始化先进行两轮练习
    this.showDialog()
    //初始化optionmode
    this.iniOptionalMode()
  },
  beforeDestroy () {

  }
}
</script>

<style lang='scss'>
@import url("./game.scss");
</style>