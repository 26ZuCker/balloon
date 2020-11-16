import { _update, _submit } from '@api/game';
import Notify from '@com/vant-weapp/dist/notify/notify.js';
import Taro from '@tarojs/taro';
/**
 * 打气
 */
function blow() {
  //未达到爆炸点前点击
  const current_point = this.viewSettings.blast_point_list[this.mode][
    30 - this.statistics.left_checkpoint.value
  ];
  if (this.count < current_point) {
    this.count += this.viewSettings.money;
    this.statistics.round_income.value = this.count;
    //这次点击达到爆炸点
    if (this.count === current_point) {
      this.isBombing = !0;
      Notify({ type: 'warning', message: '爆炸' });
    }
  }
  //再点击一次则统计本轮收益
  else {
    this.accountReceive();
  }
}
/**
 * 收账
 */
async function accountReceive() {
  let previous_income = this.count;
  if (this.isBombing) {
    previous_income = 0;
  }
  //发送数据，注意不能影响下一次
  const params = {
    batch: this.submitSettings.batch,
    alipay: this.userInfo.alipay,
    group: this.userInfo.group,
    name: this.userInfo.name,
    phone_number: this.userInfo.phone_number,
    school_number: this.userInfo.school_number,
    type: this.mode === 'team' ? 1 : 0,
    /*     submit_data: {
      blast_point: this.statistics,
      hit_count: 12,
      income: 12999990,
      is_blast: this.isBombing,
    }, */
  };
  //需要统计数据
  this.takeStatistics(previous_income);
  //当前清零
  this.count = 0;
  //视图改变
  this.isBombing = false;
  try {
    await _submit(params);
  } catch (error) {
    console.log(error);
  }
}
/**
 * 展示对话框，timeout后才能通过点击按钮触发事件，具体参数通过prop响应式传递给组件
 */
function showDialog(timeout = 2000, contentMsg = [''], showBtn = !0) {
  this.isDialog = !0;
  this.waitingSecond = timeout;
  this.changeProps(contentMsg, showBtn);
}
/**
 * 监听对话框传的点击确认按钮事件
 * 回调包括：可能改变模式，改变传入的文案
 * 以下情况派发按钮的回调不需要改变当前模式，有两次点击时不能更改模式的
 * 1.练习模式之前，此时在生命周期内进行初始化的changeMode即可
 * 2.15关之后的等待
 * 3.练习模式之后先改变，但是点击时不能进行改变
 * 如果在正式模式后进行点击，需要进行loading处理
 */
function confirmDialog() {
  this.isDialog = false;
}
/**
 * 判断是否正确获取到游戏配置
 */
function judgeOK() {
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
}
export { blow, accountReceive, showDialog, confirmDialog, judgeOK };
