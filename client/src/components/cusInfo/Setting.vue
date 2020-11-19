<template>
  <view style="height: 100%; width: 100%">
    <!-- 顶部消息框 -->
    <van-notify id="van-notify" />
    <!-- 骨架屏等待 -->
    <van-notice-bar
      :scrollable="false"
      :wrapable="true"
      speed="40"
      color="#1989fa"
      background="#ecf9ff"
      left-icon="info-o"
      text="请填写当前批次游戏的配置"
      custom-class="my-3"
    ></van-notice-bar>
    <!-- 顶部通知条 -->
    <view style="height: 100%; width: 100%">
      <!-- 顶部提示语 -->

      <!-- 主体 -->
      <view class="">
        <!-- 输入框 -->
        <van-cell-group>
          <view v-for="(i, key) in form" :key="i.title">
            <!--  -->
            <view v-if="areaForm(key)">
              <van-divider
                contentPosition="center"
                customStyle="color: #1989fa; border-color: #1989fa; font-size: 18px;"
              >
                {{ i.title }}
              </van-divider>
              <textarea
                :placeholder="`请输入${i.title}`"
                @confirm="onInput(key, $event)"
                auto-height
              ></textarea>
            </view>
            <!--  -->
            <van-field
              v-else
              :value="i.value"
              @change="onInput(key, $event)"
              required
              autosize
              clearable
              :label="i.title"
              :placeholder="`请输入${i.title}`"
            ></van-field>
          </view>
          <!-- 开关判断是否需要团队模式先于个人 -->
          <van-divider customStyle=" font-size: 18px;"> </van-divider>
          <van-cell title="实时更新">
            <van-switch
              active-color="#07c160"
              :checked="is_update"
              @change="is_update = !is_update"
            ></van-switch>
          </van-cell>
          <van-cell title="个人模式优先">
            <van-switch
              active-color="#07c160"
              :checked="game_mode"
              @change="game_mode = !game_mode"
            ></van-switch>
          </van-cell>
        </van-cell-group>
        <van-divider customStyle=" font-size: 18px;"> </van-divider>
        <!-- 选择日期 -->
        <van-cell title="结束时间" :value="formatTime"></van-cell>
        <van-datetime-picker
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
            >生成游戏二维码</van-button
          >
          <van-button
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
//工具函数
import validate from '@util/validate'
import { formatTime } from '@util/time'
//视图
import Notify from '@com/vant-weapp/dist/notify/notify.js';
import myQRCODE from '@img/myQRCODE.jpg';
//管理者
import { get_game_setting_template, submit_game_setting } from '@api/setting.js';
//预加载配置
import { get_game_settings, _update, _submit } from '@api/game';
export default {
  inheritAttrs: false,
  name: 'Setting',
  components: {
  },
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
      this.submitSetting();
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
     * 是否展示大框
     */
    areaForm () {
      return function (key) {
        return key === 'team_tips' || key === 'personal_tips' || key === 'practice_tips' || key === 'game_tips'
      }
    },
    /**
     * 输入框提示文字
     */
    placeholderTitle () {
      return function (title) {
        return `请输入${title}`
      }
    },
  },
  async mounted () {
    this.currentTime = new Date().getTime()
    this.end_time = new Date().getTime()
    this.form = this.getGameSettingTemplate()
  }
}
</script>