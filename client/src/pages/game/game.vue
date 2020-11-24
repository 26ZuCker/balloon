<template>
  <view style="height: 100%">
    <!-- 顶部通知条 -->
    <van-notify id="van-notify" />
    <!-- 顶部提示语 -->
    <van-divider
      contentPosition="center"
      customStyle="color: #1989fa; border-color: #1989fa; font-size: 18px;"
    >
      {{ titleNotice }}
    </van-divider>
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
      <!-- 展示实时 -->
      <van-cell
        v-if="viewSettings.is_update && mode === 'team'"
        title="实时数据"
        :value="average_income"
      ></van-cell>
      <!-- 主体 -->
      <van-cell
        class="statistic-main"
        v-for="i in statistics"
        :key="i.title"
        :title="i.title"
        :value="i.value"
      ></van-cell>
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
      :showBtn="showBtn"
    ></Dialog>
  </view>
</template>

<script>
import Notify from '@com/vant-weapp/dist/notify/notify.js';
import Taro, { connectSocket } from '@tarojs/taro';
import { mapState, mapGetters } from 'vuex'
//图片
import balloon from '@img/balloon.jpg'
import bomb from '@img/bomb.jpg'
//组件
import Dialog from '@com/common/Dialog.vue';
import { _update, _submit } from '@api/game';
/**
 * title顶部标题语
 * tip弹出框提示语
 */
const optionalMode = {
  TRAIN: { title: '练习模式', tip: '当前为练习模式', btnMsg: '确认' },
  personal: { title: '', tip: '', btnMsg: '确认' },
  team: { title: '', tip: '', btnMsg: '确认' },
  OVER: { title: '为队伍收账', tip: '当前为队伍模式', btnMsg: '确认' },
};
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
    //所需收集的数据
    statistics: {
      round_income: { title: '本轮收益', value: 0 },
      total_income: { title: '总收益', value: 0 },
      previous_income: { title: '上一轮收益', value: 0 },
      left_checkpoint: { title: '剩余关卡', value: 20 },
    },
    showBtn: !0,
    mode: '',
    //展示实时数据
    showCurrent: true,
    average_income: 0
  }),
  methods: {
    /**
     * 打气
     */
    blow () {
      let current_point = 0
      if (this.mode === 'TRAIN') {
        current_point = this.viewSettings.blast_point[this.mode][2 - this.statistics.left_checkpoint.value]
      } else {
        //未达到爆炸点前点击
        current_point = this.viewSettings.blast_point[this.mode][
          20 - this.statistics.left_checkpoint.value
        ];
      }
      if (this.count / this.viewSettings.money < current_point) {
        this.count += this.viewSettings.money;
        this.statistics.round_income.value = this.count;
        //这次点击达到爆炸点
        if (this.count / this.viewSettings.money >= current_point) {
          this.isBombing = !0;
          Notify({ type: 'warning', message: '爆炸' });
        }
      }
      //再点击一次则统计本轮收益
      else {
        this.accountReceive();
      }
    },
    /**
     * 收账
     */
    async accountReceive () {
      let previous_income = this.count;
      if (this.isBombing) {
        previous_income = 0;
      }
      const blast_point = this.mode === 'TRAIN' ? 0
        : this.viewSettings.blast_point[this.mode][20 - this.statistics.left_checkpoint.value]
      //发送数据，注意不能影响下一次
      const params = {
        batch: this.submitSettings.batch,
        alipay: this.userInfo.alipay,
        group: this.userInfo.group,
        name: this.userInfo.name,
        phone_number: this.userInfo.phone_number,
        school_number: this.userInfo.school_number,
        type: this.mode === 'team' ? 1 : 0,
        submit_data: {
          //当前爆破点
          blast_point: blast_point,
          //点击次数
          hit_count: this.count / this.viewSettings.money,
          //该次总收入
          income: this.count,
          //是否爆炸
          is_blast: this.isBombing,
        },
      };
      //需要统计数据
      this.takeStatistics(previous_income);
      //当前清零
      this.count = 0;
      //视图改变
      this.isBombing = false;
      //练习模式
      if (blast_point === 0) {
        return
      }
      console.log(params)
      try {
        await _submit(params);
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 展示对话框，timeout后才能通过点击按钮触发事件，具体参数通过prop响应式传递给组件
     */
    showDialog (timeout = 2000, contentMsg = '', showBtn = !0) {
      this.isDialog = !0;
      this.waitingSecond = timeout;
      if (contentMsg[0] !== '') {
        this.changeProps(contentMsg, showBtn);
      }
    },
    /**
     * 监听对话框传的点击确认按钮事件
     * 回调包括：可能改变模式，改变传入的文案
     * 以下情况派发按钮的回调不需要改变当前模式，有两次点击时不能更改模式的
     * 1.练习模式之前，此时在生命周期内进行初始化的changeMode即可
     * 2.15关之后的等待
     * 3.练习模式之后先改变，但是点击时不能进行改变
     * 如果在正式模式后进行点击，需要进行loading处理
     */
    confirmDialog () {
      if (this.mode === 'OVER') {
        //复制至剪贴板
        Taro.setClipboardData({
          data: this.viewSettings.questionnaire_link,
          success: function (res) {
            Taro.getClipboardData({
              success: function (res) {
                //console.log(res)
              }
            })
          }
        })
        return
      }
      this.isDialog = false;
    },
    /**
     * 判断是否正确获取到游戏配置
     */
    judgeOK () {
      if (!this.isOk) {
        Notify({ type: 'danger', message: '网络请求错误，请重新输入' });
        const timer = setTimeout(() => {
          Taro.redirectTo({
            url: '../cusInfo/cusInfo',
          });
        }, 1000);
        this.$on('beforeDestroy', () => {
          clearTimeout(timer);
        });
      }
    },
    /**
 * 重新开始当前该用户当前批次的游戏，不必清空整个统计数据而只重置剩余关卡，不改变模式
 */
    restart () {
      /*       if (this.mode === 'TRAIN') {
            } */
      this.count = 0;
      this.statistics.left_checkpoint.value = this.mode === 'OVER' ? 0 : 20;
    },
    /**
     * 改变模式，只能单向不可逆
     */
    changeMode () {
      //练习模式之前
      if (this.mode === '') {
        this.mode = 'TRAIN';
        this.statistics.left_checkpoint.value = 2;
        this.changeProps();
        return
      }
      //练习模式之后，正式模式之前，注意这里由于dialog关闭存在动画即非即时关闭所以只能设置一个定时器进行数据更新
      else if (this.mode === 'TRAIN') {
        this.mode = this.viewSettings.game_mode === 0 ? 'personal' : 'team'
        this.statistics.total_income.value = 0
        this.statistics.left_checkpoint.value = 20;
        this.restart();
        this.changeProps(this.viewSettings.game_tips);
        //练习模式结束后开始实时更新
        if (this.viewSettings.is_update) {
          const timer = setInterval(() => {
            this.update()
          }, 2000)
          this.$on('beforeDestroy', () => {
            clearInterval(timer)
          })
        }
        return
      }
      //所有模式结束，直接离开
      else if (this.mode === 'OVER') {
        this.changeProps('', '');
        this.showDialog(0, [`请点击按钮复制以下链接，以填写问卷星`, `${this.viewSettings.questionnaire_link}`]);
        return
      }
      //正式模式30关结束后，包括团队此时需要回调
      /* this.mode = this.mode === 'team'
        ? (this.viewSettings.game_mode === 0 ? 'OVER' : 'personal')
        : (this.viewSettings.game_mode === 0 ? 'team' : 'OVER') */
      this.mode = 'OVER'
      const str = this.mode === 'team' ? '下一轮为团队收益' : '下一轮为自己收益'
      this.restart();
      this.showDialog(1500, str, '继续游戏');
      this.changeProps();
    },
    /**
     * 改变传给dialog的props
     */
    changeProps (contentMsg = '', confirmBtnText = '', showBtn = !0) {
      //只要非练习模式，点击结束按钮都会展示该轮比赛成绩
      this.contentMsg = contentMsg === '' ? this.statisticsMsg() : contentMsg;
      if (!showBtn) {
        this.showBtn = showBtn;
      }
    },
    /**
     * 统计信息文本化，后期需要修改即只有当结束游戏时才会进行computed否则这会一直更新缓存
     */
    statisticsMsg () {
      return this.mode === 'TRAIN'
        ? this.viewSettings.practice_tips
        : this.viewSettings.round_tips[this.mode]
    },
    /**
     * 派发收账按钮的回调，统计和收集每一轮所需的数据
     */
    takeStatistics (previous_income = 0) {
      this.statistics.previous_income.value = previous_income;
      this.statistics.round_income.value = 0;
      this.statistics.total_income.value += this.statistics.previous_income.value;
      this.statistics.left_checkpoint.value -= 1;
      //如果当前为练习模式则展示即初始化
      if (this.mode === 'TRAIN' && this.statistics.left_checkpoint.value === 0) {
        this.changeMode();
        this.showDialog();
        return;
      }
      //如果进入16关则需要强制休息15s
      if (this.statistics.left_checkpoint.value === 10) {
        this.showDialog(1500, '休息一下', '继续游戏');
      }
      //正式模式及团队模式30关全部结束
      if (this.statistics.left_checkpoint.value === 0) {
        this.changeMode();
        if (this.mode === 'OVER') {
          //此处不需要等待，但需要展示按钮进行提交选项
          this.showDialog(0, '', '', false);
        }
      }
    },
    /**
     * 初始化四个提示语：练习模式和正式模式dialog，个人和团队的顶部title
     * @param {boolean} personOnGroup
     */
    iniOptionalMode (game_mode) {
      [optionalMode.TRAIN.tip, optionalMode.personal.tip] = [
        this.viewSettings.practice_tips,
        this.viewSettings.game_tips,
      ];
      [optionalMode.personal.title, optionalMode.team.title] =
        [this.viewSettings.round_tips.personal, this.viewSettings.round_tips.team]
    },
    /**
     * 实时更新平均收入
     */
    async update () {
      const [batch, group] = [this.submitSettings.batch, this.submitSettings.group]
      let res;
      try {
        res = await _update({ batch: batch, group: group });
        if (typeof res !== 'string') {
          this.average_income = res.average_income || '暂无数据'
          return
        }
      } catch (error) {
        console.log(error);
      }
      this.average_income = '暂无数据'
    }
  },
  computed: {
    balloon () { return balloon },
    bomb () { return bomb },
    /**
     * 图片大小改变
     */
    imgStyle () {
      //保证每次按比例改变图片大小
      const point = this.count / this.viewSettings.money
      const width = point * 8 + 100
      const height = point * 5 + 100
      return `width: ${width}px; height: ${height}px`
    },
    /**
     * 顶部标题
     */
    titleNotice () {
      return this.mode === '' ? '' : optionalMode[this.mode].title
    },
    ...mapState({
      viewSettings: (state) => state.game.viewSettings,
      submitSettings: (state) => state.game.submitSettings,
      userInfo: (state) => state.user.userInfo,
    }),
    ...mapGetters({
      isOk: 'game/isOk'
    })
  },
  watch: {
    mode (n) {
      console.log(n)
      if (n === 'OVER') {
        this.changeMode()
      }
    }
  },
  mounted () {
    this.judgeOK()
    this.statistics.left_checkpoint.value = 2
    this.changeMode()
    //初始化先进行两轮练习
    this.showDialog()
    //初始化optionmode
    this.iniOptionalMode(this.viewSettings.game_mode)
  },
}
</script>
<style lang='scss'>
@import url("./game.scss");
</style>