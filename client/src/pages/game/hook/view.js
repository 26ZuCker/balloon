/**
 * 打气
 */
function blow() {
  //未达到爆炸点前点击
  const current_point = blast_point_list[30 - this.statistics.left_checkpoint.value];
  if (this.count < current_point) {
    this.count += 1;
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
  //需要统计数据
  this.takeStatistics(previous_income);
  //当前清零
  this.count = 0;
  //视图改变
  this.isBombing = false;
  //发送数据，注意不能影响下一次
  try {
    await submit(this.statistics);
  } catch (error) {
    console.log(error);
  }
}
/**
 * 展示对话框，timeout后才能通过点击按钮触发事件，具体参数通过prop响应式传递给组件
 */
function showDialog(timeout = 2000, contentMsg = [''], confirmBtnText = '', showBtn = !0) {
  this.isDialog = !0;
  this.waitingSecond = timeout;
  this.changeProps(contentMsg, confirmBtnText, showBtn);
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
export { blow, accountReceive, showDialog, confirmDialog };