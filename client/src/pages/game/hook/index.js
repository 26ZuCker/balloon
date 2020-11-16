import { blow, accountReceive, showDialog, confirmDialog, judgeOK } from './view.js';
import {
  changeMode,
  changeProps,
  takeStatistics,
  iniOptionalMode,
  statics_template,
  optionalMode,
  update,
  statisticsMsg,
  restart,
} from './model.js';
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
/**
 * 统计信息模板
 */
const statics_template = {
  round_income: { title: '本轮收益', value: 0 },
  total_income: { title: '总收益', value: 0 },
  previous_income: { title: '上一轮收益', value: 0 },
  left_checkpoint: { title: '剩余关卡', value: 30 },
};
const gameHook = {
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
    statistics: null,
    showBtn: !0,
    mode: '',
    //展示实时数据
    showCurrent: true,
    average_income: 0,
  }),
  methods: {
    //view
    blow,
    accountReceive,
    showDialog,
    confirmDialog,
    judgeOK,
    //model
    changeMode,
    changeProps,
    takeStatistics,
    iniOptionalMode,
    statics_template,
    optionalMode,
    update,
    statisticsMsg,
    restart,
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
      return this.mode === '' ? '' : optionalMode[this.mode].title;
    },
    ...mapState({
      viewSettings: (state) => state.game.viewSettings,
      submitSettings: (state) => state.game.submitSettings,
      userInfo: (state) => state.user.userInfo,
    }),
    ...mapGetters({
      isOk: 'game/isOk',
    }),
  },
};

export default gameHook;
