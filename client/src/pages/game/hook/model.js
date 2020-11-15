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
 * 爆破点，由于view需要使用，所以通过esm导出以共用
 */
const blast_point_list = {
  team: [],
  personal: [],
};
/**
 * 改变模式，只能单向不可逆
 */
function changeMode() {
  //练习模式之前
  if (this.mode === '') {
    console.log('1');
    this.mode = 'TRAIN';
    statics_template.left_checkpoint.value = 2;
    this.changeProps();
  }
  //练习模式之后，正式模式之前，注意这里由于dialog关闭存在动画即非即时关闭所以只能设置一个定时器进行数据更新
  else if (this.mode === 'TRAIN') {
    console.log('2');
    this.mode = 'personal';
    statics_template.left_checkpoint.value = 30;
    this.restart();
    this.changeProps();
  }
  //正式模式30关结束后，包括团队此时需要回调
  else if (this.mode === 'personal') {
    console.log('3');
    this.mode = 'team';
    this.restart();
    this.changeProps();
  } else if (this.mode === 'team') {
    console.log('4');
    this.mode = 'OVER';
    this.restart();
    this.changeProps();
  }
  //所有模式结束，直接离开
  else if (this.mode === 'OVER') {
    console.log('5');
    this.changeProps('', '', false);
    this.showDialog(0);
  }
}
/**
 * 改变传给dialog的props
 */
function changeProps(contentMsg = [''], confirmBtnText = '', showBtn = !0) {
  //只要非练习模式，点击结束按钮都会展示该轮比赛成绩
  this.contentMsg = contentMsg[0] === '' ? this.statisticsMsg() : contentMsg;
  if (!showBtn) {
    this.showBtn = showBtn;
  }
}
/**
 * 派发收账按钮的回调，统计和收集每一轮所需的数据
 */
function takeStatistics(previous_income = 0) {
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
  if (this.statistics.left_checkpoint.value === 15) {
    this.showDialog(1500, ['休息一下'], '继续游戏');
  }
  //正式模式及团队模式30关全部结束
  if (this.statistics.left_checkpoint.value === 0) {
    this.changeMode();
    if (this.mode === 'OVER') {
      //此处不需要等待，但需要展示按钮进行提交选项
      this.showDialog(0, [''], '', false);
    }
  }
}
/**
 * 初始化提示语
 * @param {number} personOnGroup
 */
function iniOptionalMode(personOnGroup) {
  [blast_point_list, optionalMode.TRAIN.tip, optionalMode.personal.tip] = [
    blast_point_list,
    this.viewSettings.practice_tips,
    this.viewSettings.game_tips,
  ];
  [optionalMode.personal.title, optionalMode.team.title] = personOnGroup
    ? [this.round_tips.personal, this.round_tips.team]
    : [this.round_tips.team, this.round_tips.personal];
}
/**
 * 实时更新平均收入
 */
async function update() {
  let res;
  try {
    res = await _update();
  } catch (error) {
    console.log(error);
  }
  this.average_income = res.average_income;
}
export {
  changeMode,
  changeProps,
  takeStatistics,
  iniOptionalMode,
  statics_template,
  optionalMode,
  update,
  blast_point_list,
};
