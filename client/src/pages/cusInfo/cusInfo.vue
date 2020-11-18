<template>
  <view style="height: 100%; width: 100%">
    <!-- 顶部消息框 -->
    <van-notify id="van-notify"></van-notify>
    <!-- 骨架屏等待 -->
    <van-skeleton title row="15" v-if="isSkeleton"></van-skeleton>
    <!-- 顶部通知条 -->
    <view v-else style="height: 100%; width: 100%">
      <!-- 顶部提示语 -->
      <van-notice-bar
        :scrollable="false"
        :wrapable="true"
        speed="40"
        color="#1989fa"
        background="#ecf9ff"
        left-icon="info-o"
        :text="titleNotice"
      ></van-notice-bar>
      <!-- 主体 -->
      <view class="page-y-center">
        <!-- 输入框 -->
        <van-cell-group>
          <!-- 基本框 -->
          <van-field
            :value="i.value"
            @change="onInput(key, $event)"
            required
            autosize
            clearable
            :label="i.title"
            :placeholder="`请输入${i.title}`"
            v-for="(i, key) in form"
            :key="i.title"
          >
          </van-field>
          <!-- 开关判断是否需要团队模式先于个人 -->
          <van-cell title="实时更新" v-if="permission === 1">
            <van-switch
              active-color="#07c160"
              :checked="is_update"
              @change="is_update = !is_update"
            ></van-switch>
          </van-cell>
          <van-cell title="个人模式优先" v-if="permission === 1">
            <van-switch
              active-color="#07c160"
              :checked="game_mode"
              @change="game_mode = !game_mode"
            ></van-switch>
          </van-cell>
        </van-cell-group>
        <!-- 选择日期 -->
        <van-cell
          title="结束时间"
          :value="formatTime"
          v-if="permission === 1"
        ></van-cell>
        <van-datetime-picker
          v-if="permission === 1"
          type="datetime"
          :value="end_time"
          @confirm="onInputTime"
          :min-date="currentTime"
          data-type="datetime"
        ></van-datetime-picker>
        <!-- 根据角色判断权限，底部交互按钮 -->
        <view class="rca my-3">
          <van-button
            custom-class="van-button--round van-button--large ma-3"
            type="primary"
            :loading="isLoading"
            @tap="submitChange"
            >{{ btnTitle }}</van-button
          >
          <van-button
            v-if="permission === 1"
            custom-class="van-button--round van-button--large ma-3"
            type="success"
            @tap="toInfo"
            >查看记录</van-button
          >
        </view>
      </view>
      <!-- 遮掩层显示二维码 -->
      <van-overlay :show="showOverlay" @click="showOverlay = false">
        <view class="page-y-center ccc">
          <image
            style="height: 350px; width: 350px; margin-bottom: 50px"
            mode="aspectFit"
            :src="QRCODE_URL"
          ></image>
          <van-icon name="close" size="40px" @tap="showOverlay = false" />
        </view>
      </van-overlay>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { mapState, mapMutations, mapActions } from 'vuex'
//工具函数
import validate from '@util/validate'
import { formatTime } from '@util/time'
//视图
import Notify from '@com/vant-weapp/dist/notify/notify.js';
import myQRCODE from '@img/myQRCODE.jpg';
//参与者
import { get_userInfo_template } from '@api/user.js';
//管理者
import { get_game_setting_template, submit_game_setting } from '@api/setting.js';
//预加载配置
import { get_game_settings, _update, _submit } from '@api/game';
export default {
  inheritAttrs: false,
  name: 'cusInfo',
  components: {},
  data: () => ({
    //表单
    form: null,
    is_update: true,
    game_mode: true,
    //时间选择
    end_time: undefined,
    currentTime: undefined,
    formatTime: undefined,
    //视图
    isSkeleton: true,
    isLoading: false,
    showOverlay: false,
    QRCODE_URL: '',
  }),
  props: {},
  methods: {
    /**
     * 监听时间选择器
     */
    onInputTime (event) {
      this.end_time = event.detail
    },
    /**
     * 监听表单输入，后期注意防抖
     */
    onInput (key, $event) {
      this.form[key].value = $event.detail;
    },
    /**
     * 校验表单输入值合法性：
     */
    validateForm () {
      if (this.form === null) {
        return !1;
      }
      for (const key in this.form) {
        const cur = this.form[key]
        const validator = cur.validator || {}
        //如果validator存在且有值
        if (Object.keys(validator).length !== 0) {
          const bool = validate(cur.value, validator.validType, validator.selfType)
          if (!bool) {
            Notify({ type: 'danger', message: `${cur.title}格式填写错误` })
            return false
          }
        }
        //否则直接当做普通的文本框
        else {
          if (cur.value.length === 0) {
            Notify({ type: 'danger', message: '你尚未填写完毕' })
            return false
          }
        }
      }
      return true
    },
    /**
     * 根据路由传参判断当前页面为配置还是个人信息填写
     */
    submitChange () {
      Notify({ type: 'warning', message: '提交中' });
      if (!this.validateForm()) {
        return;
      }
      if (this.permission === 0) {
        this.submitUserInfo();
      } else if (this.permission === 1) {
        this.submitSetting();
      }
    },
    /**
     * 提交用户信息之后再获取游戏参数
     */
    async submitUserInfo () {
      this.isLoading = !0;
      //先提交
      const params = {};
      for (const key in this.form) {
        params[key] = this.form[key].value;
      }
      this.setUserInfo(params);
      //后获取此批游戏配置
      const [batch, group] = [this.form.batch.value, this.form.group.value];
      let res;
      try {
        res = await this.getGameSetting({ batch: batch, group: group });
        this.isLoading = !1;
        if (typeof res !== 'string') {
          this.setSettings(res);
          Taro.navigateTo({
            url: '../game/game',
          });
          return
        }
        Notify({ type: 'danger', message: res });
      } catch (error) {
        return error;
      }
    },
    /**
     * 提交更改配置
     */
    async submitSetting () {
      this.isLoading = !0;
      const params = {};
      for (const key in this.form) {
        params[key] = this.form[key].value;
      }
      params['is_update'] = this.is_update;
      params['blast_point_distribution'] = 0;
      params['game_mode'] = this.game_mode ? 0 : 1;
      params['end_time'] = this.end_time
      try {
        const res = await submit_game_setting(params);
        if (typeof res === 'string') {
          Notify({ type: 'danger', message: res });
        }
      } catch (error) {
        return error;
      }
      //改变视图
      this.isLoading = !1;
      this.showOverlay = !0;
      this.QRCODE_URL = myQRCODE;
    },
    /**
     * 获取游戏配置
     */
    async getGameSetting (params) {
      try {
        return await get_game_settings(params);
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 建议进入前根据传入一个状态值判断当前用户是否已填写过该表格避免重复填写
     */
    getUserInfoTemplate () {
      const res = get_userInfo_template();
      return res;
    },
    /**
     * 获取游戏配置填写模板
     */
    getGameSettingTemplate () {
      const res = get_game_setting_template();
      return res;
    },
    /**
     * 进入历史记录页面
     */
    toInfo () {
      Taro.navigateTo({ url: '../info/info' })
    },
    ...mapMutations(
      { setSettings: 'game/setSettings', setUserInfo: 'user/setUserInfo' }
    ),
    ...mapActions({
      login: 'user/login'
    })
  },
  watch: {
    /**
     * 格式化时间戳
     */
    end_time: {
      handler (n) {
        this.formatTime = formatTime(n, false)
      }, immediate: true
    }
  },
  computed: {
    /**
     * 输入框提示文字
     */
    placeholderTitle () {
      return function (title) {
        return `请输入${title}`
      }
    },
    /**
     * 提交按钮显示文案
     */
    btnTitle () {
      return this.permission === 0 ? '提交' : '生成游戏二维码'
    },
    /**
     * 顶部提示框
     */
    titleNotice () {
      return this.permission === 0 ? '请填写你的个人信息'
        : '请填写当前批次游戏的配置'
    },
    ...mapState({
      permission: (state) => state.user.permission,
      submitSettings: (state) => state.game.submitSettings,
    })
  },
  /**
    * 统一进入该页面
    * 建议挂载全局变量判断cusInfo是否已提交则没必要额外再发送一次login请求
    * 在进入游戏三个按钮的页面，进入前先传openid到后台，根据传回的自定义状态码判断身份
    * 获取openid和微信个人信息 -> 发送至后台判断身份
    * 研究生身份：提供数据导出和实验组批次设置两个url
    * 参与者身份：直接跳转至cusInfo，注意此时需要初始化研究生的模板存入vuex
    */
  async mounted () {
    this.currentTime = new Date().getTime()
    this.end_time = new Date().getTime()
    await this.login()
    const bool = this.permission === 0
    //填写的模板
    this.form = bool ? this.getUserInfoTemplate() : this.getGameSettingTemplate()
    this.isSkeleton = false
  }
}
</script>

<style lang='scss' >
@import url("./cusInfo.scss");
</style>