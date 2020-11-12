import Taro from '@tarojs/taro';
//api
import {} from '@api/game';
//图片
import balloon from '@img/balloon.jpg';
import bomb from '@img/bomb.jpg';
//组件
import Dialog from '@com/common/Dialog.vue';
import Notify from '@com/vant-weapp/dist/notify/notify.js';

//注意：与渲染无关的变量尽量不要存在data内
const optionalMode = {
  TRAIN: { title: '练习模式', tip: '当前为练习模式', btnMsg: '结束练习' },
  PERSON: { title: '为自己收账', tip: '当前为个人模式', btnMsg: '结束游戏' },
  GROUP: { title: '为队伍收账', tip: '当前为队伍模式', btnMsg: '结束游戏' },
};
/**
 * 统计信息模板
 */
const statics_template = {
  round_income: { title: '本轮收益', value: 0 },
  total_income: { title: '总收益', value: 0 },
  previous_income: { title: '上一轮收益', value: 0 },
  left_checkpoint: { title: '剩余关卡', value: 30 },
};
/**
 * 当前模式
 */
let mode = 'TRAIN';
/**
 * 最大点击次数
 */
let maxCount = 15;

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
    waitingSecond: 2000,
    contentMsg: '',
    confirmBtnText: '',
  }),
  methods: {
    /**
     * 打气
     */
    blow() {
      //未达到爆炸点前点击
      if (this.count < maxCount) {
        this.count += 1;
        this.statistics.round_income.value = this.count;
        //这次点击达到爆炸点
        if (this.count === maxCount) {
          this.isBombing = true;
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
    accountReceive() {
      let previous_income = this.count;
      if (this.isBombing) {
        previous_income = 0;
      }
      //需要统计数据
      this.takeStatistics(previous_income);
      //当前清零
      this.count = 0;
      //视图改变
      this.isBombing = false;
    },
    /**
     * 响应dialog的结束游戏按钮
     */
    async endGame() {
      if (mode === 'TRAIN') {
        this.changeMode();
      } else {
        this.changeMode();
        this.isSubmitting = true;
        Taro.navigateTo({ url: '../open/open' });
      }
    },
    /**
     * 改变模式，只能单向不可逆：TRAIN -> PERSON -> GROUP
     * 需要更改模式只有三种情况：初始化，每一轮游戏结束后
     */
    changeMode(isTrain = false) {
      //练习模式之前
      if (isTrain) {
        mode = 'TRAIN';
        statics_template.left_checkpoint.value = 2;
        this.confirmBtnText = optionalMode[mode].btnMsg;
        //只要非练习模式，点击结束按钮都会展示该轮比赛成绩
        this.contentMsg = optionalMode[mode].tip;
      }
      //练习模式之后，正式模式之前
      else if (mode === 'TRAIN' && !isTrain) {
        mode = 'PERSON';
        statics_template.left_checkpoint.value = 30;
        this.confirmBtnText = optionalMode[mode].btnMsg;
        this.contentMsg = this.statisticsMsg();
        this.restart();
      }
      //正式模式之后
      else if (mode === 'PERSON') {
        mode = 'GROUP';
        this.confirmBtnText = optionalMode[mode].btnMsg;
        this.contentMsg = this.statisticsMsg();
        this.restart();
      }
      //直接结束游戏
      else if (mode === 'GROUP') {
        return;
      }
    },
    /**
     * 统计和收集每一轮所需的数据
     */
    takeStatistics(previous_income = 0) {
      this.statistics.previous_income.value = previous_income;
      this.statistics.round_income.value = 0;
      this.statistics.total_income.value += this.statistics.previous_income.value;
      this.statistics.left_checkpoint.value -= 1;
      //如果当前为练习模式则展示
      if (mode === 'TRAIN' && this.statistics.left_checkpoint === 0) {
        this.changeMode();
        this.showDialog();
        return;
      }
      //如果进入16关则需要强制休息15s
      if (this.statistics.left_checkpoint === 15) {
        this.showDialog(15000);
      }
      //游戏全部结束
      if (this.statistics.left_checkpoint.value === 0) {
        this.changeMode();
        this.showDialog();
      }
    },
    /**
     * 展示对话框，timeout后才能通过点击按钮触发事件，具体参数通过prop响应式传递给组件
     */
    showDialog(timeout = 2000) {
      this.isDialog = true;
      this.waitingSecond = timeout;
    },
    /**
     * 对话框接收
     */
    confirmDialog() {
      //练习模式点击只关闭dialog
      this.isDialog = false;
      //练习模式点击还需要改变模式
      if (mode !== 'TRAIN') {
        this.changeMode();
      }
    },
    /**
     * 重新开始当前该用户当前批次的游戏，清空整个统计数据，不改变模式
     */
    restart() {
      this.count = 0;
      this.statistics = statics_template;
    },
    /**
     * 统计信息文本化，后期需要修改即只有当结束游戏时才会进行computed否则这会一直更新缓存
     */
    statisticsMsg() {
      if (mode === 'TRAIN') {
        return '练习模式介绍';
      } else if (mode === 'PERSON') {
        return '个人模式介绍';
      }
      let res = '';
      if (this.statistics === null) {
        return '';
      }
      for (const i in this.statistics) {
        res += `${this.statistics[i].title} : ${this.statistics[i].value} \n`;
      }
      return res;
    },
  },
  computed: {
    balloon() {
      return balloon;
    },
    bomb() {
      return bomb;
    },
    /**
     * 图片大小改变
     */
    imgStyle() {
      const width = this.count * 8 + 100;
      const height = this.count * 5 + 100;
      return `width: ${width}px; height: ${height}px`;
    },
    /**
     * 顶部标题
     */
    titleNotice() {
      return optionalMode[mode].title;
    },
  },
  watch: {
    /*     mode: {
          handler (n) {
            //isDialog: false,
            //waitingSecond: 20,
            this.dialogTitle = optionalMode[mode].title
            //this.contentMsg = optionalMode[mode].tip
            this.confirmBtnText = optionalMode[mode].btnMsg
          }, immediate: true
        } */
  },
  async created() {
    this.statistics = statics_template;
    this.changeMode(true);
    //初始化先进行两轮练习
    this.showDialog();
  },
  beforeDestroy() {},
};
