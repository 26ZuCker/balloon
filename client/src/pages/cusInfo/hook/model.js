import Notify from '@com/vant-weapp/dist/notify/notify.js';

//参与者
import { get_userInfo_template, submit_userInfo } from '@api/user.js';
//管理者
import { get_game_setting_template, submit_game_setting } from '@api/setting.js';
//预加载配置
import { get_game_setting } from '@api/game';
/**
 * 监听表单输入，后期注意防抖
 */
function onInput(key, $event) {
  this.form[key].value = $event.detail;
}

/**
 * 校验表单输入值合法性：
 * 1.是否填写完毕
 * 2.每一块是否输入有效数值，注意即使输入number也转换为string即可
 */
function validateForm() {
  if (this.form === null) {
    return false;
  }
  //目前只校验是否已输入
  for (const i in this.form) {
    if (this.form[i].value.length === 0) {
      return false;
    }
  }
  return true;
}
/**
 * 建议进入前根据传入一个状态值判断当前用户是否已填写过该表格避免重复填写
 */
async function getUserInfoTemplate() {
  const res = await get_userInfo_template();
  return res;
}
async function getGameSettingTemplate() {
  const res = await get_game_setting_template();
  return res;
}
/**
 * 根据路由传参判断当前页面为配置还是个人信息填写
 */
function submitChange() {
  Notify({ type: 'warning', message: '提交中' });
  console.log(this.form);
  if (!this.validateForm()) {
    Notify({ type: 'danger', message: '你尚未填写完毕' });
    return;
  }
  if (this.permission === 0) {
    this.submit_userInfo();
  } else if (this.permission === 1) {
    this.submit_setting();
  }
}
/**
 * 提交用户信息
 */
async function submitUserInfo() {
  this.isLoading = !0;
  const params = {};
  for (const key in this.form) {
    params[key] = this.form[key].value;
  }
  console.log(params);
  //记得清除
  const timer = setTimeout(() => {
    this.isLoading = !1;
    Taro.navigateTo({
      url: '../game/game',
    });
  }, 1000);
}
/**
 * 提交更改配置
 */
async function submitSetting() {
  this.isLoading = !0;
  const params = {};
  for (const key in this.form) {
    params[key] = this.form[key].value;
  }
  params[game_mode] = this.personOnGroup ? 0 : 1;
  console.log(params);
  //记得清除
  const timer = setTimeout(() => {
    this.isLoading = !1;
    this.showOverlay = !0;
    this.QRCODE_URL = myQRCODE;
  }, 1000);
}
async function getGameSetting() {
  const res = await get_game_setting();
  return res;
}
export {
  onInput,
  submitChange,
  submitUserInfo,
  getUserInfoTemplate,
  validateForm,
  submitSetting,
  getGameSettingTemplate,
  getGameSetting,
};
