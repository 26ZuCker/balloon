import Notify from '@com/vant-weapp/dist/notify/notify.js';
import myQRCODE from '@img/myQRCODE.jpg';
//参与者
import { get_userInfo_template } from '@api/user.js';
//管理者
import { get_game_setting_template, submit_game_setting } from '@api/setting.js';
//预加载配置
import { get_game_settings, _update, _submit } from '@api/game';
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
    return !1;
  }
  //目前只校验是否已输入
  for (const key in this.form) {
    if (this.form[key].value.length === 0) {
      return !1;
    }
  }
  return !0;
}
/**
 * 根据路由传参判断当前页面为配置还是个人信息填写
 */
function submitChange() {
  Notify({ type: 'warning', message: '提交中' });
  if (!this.validateForm()) {
    Notify({ type: 'danger', message: '你尚未填写完毕' });
    return;
  }
  if (this.permission === 0) {
    this.submitUserInfo();
  } else if (this.permission === 1) {
    this.submitSetting();
  }
}
/**
 * 提交用户信息之后再获取游戏参数
 */
async function submitUserInfo() {
  this.isLoading = !0;
  //先提交
  const params = {};
  for (const key in this.form) {
    params[key] = this.form[key].value;
  }
  this.setUserInfo(params);
  //后获取此批游戏配置
  const batch = this.form.batch.value;
  let res;
  try {
    res = await getGameSetting({ batch: batch });
  } catch (error) {
    return error;
  }
  this.setSettings(res);
  //调整视图
  this.isLoading = !1;
  Taro.navigateTo({
    url: '../game/game',
  });
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
  params['is_update'] = this.is_update;
  params['blast_point_distribution'] = 0;
  params['game_mode'] = this.game_mode ? 0 : 1;
  try {
    await submit_game_setting(params);
  } catch (error) {
    return error;
  }
  //改变视图
  this.isLoading = !1;
  this.showOverlay = !0;
  this.QRCODE_URL = myQRCODE;
}
/**
 * 获取游戏配置
 */
async function getGameSetting(params) {
  try {
    return await get_game_settings(params);
  } catch (error) {
    console.log(error);
  }
}
/**
 * 建议进入前根据传入一个状态值判断当前用户是否已填写过该表格避免重复填写
 */
async function getUserInfoTemplate() {
  const res = await get_userInfo_template();
  return res;
}
/**
 * 获取游戏配置填写模板
 */
async function getGameSettingTemplate() {
  const res = await get_game_setting_template();
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
