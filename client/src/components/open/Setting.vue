<template>
  <view style="height: 100%; width: 100%">
    <!-- 顶部消息框 -->
    <van-notify id="van-notify" />
    <!-- 顶部消息条 -->
    <van-divider
      contentPosition="center"
      customStyle="color: #1989fa; border-color: #1989fa; font-size: 18px;"
    >
      请填写当前批次游戏的配置
    </van-divider>
    <view style="height: 100%; width: 100%">
      <!-- 输入框 -->
      <van-cell-group>
        <view v-for="(i, key) in form" :key="i.title">
          <!-- 大框 -->
          <view v-if="areaForm(key)">
            <van-divider
              contentPosition="center"
              customStyle="color: #1989fa; border-color: #1989fa; font-size: 18px;"
            >
              {{ i.title }}
            </van-divider>
            <textarea
              :maxlength="-1"
              :placeholder="`请输入${i.title}`"
              @input="onInput(key, $event)"
              auto-height
            ></textarea>
          </view>
          <!-- 普通框 -->
          <view v-else class="rsc">
            <view
              class="ma-1"
              style="
                color: #1989fa;
                font-size: 20px;
                font-weight: 200;
                width: 45%;
              "
              >{{ i.title }}</view
            >
            <input
              style="width: 100%"
              type="text"
              :placeholder="`请输入${i.title}`"
              @input="onInput(key, $event)"
            />
          </view>
        </view>
        <!-- 开关判断是否需要团队模式先于个人 -->
        <van-divider customStyle=" font-size: 18px;"> </van-divider>
        <!--         <van-cell title="实时更新">
          <van-switch
            active-color="#07c160"
            :checked="is_update"
            @change="is_update = !is_update"
          ></van-switch>
        </van-cell> -->
      </van-cell-group>
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
          >提交</van-button
        >
        <van-button
          custom-class="van-button--round van-button--large ma-3"
          type="success"
          @tap="toInfo"
          >查看记录</van-button
        >
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
//工具函数
import validate from '@util/validate'
import { formatTime } from '@util/day'
import { debounce } from '@util/HOC'
//视图
import Notify from '@com/vant-weapp/dist/notify/notify.js';
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
    is_update: false,
    //game_mode: true,
    //时间选择
    end_time: undefined,
    currentTime: undefined,
    formatTime: undefined,
    //视图
    isSkeleton: true,
    isLoading: false,
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
      const cb = () => { this.form[key].value = $event.detail.value }
      return debounce(cb)()
    },
    /**
     * 校验表单输入值合法性：
     */
    validateForm () {
      if (this.form === null) {
        return !1;
      }
      console.log(this.form)
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
      //params['game_mode'] = this.game_mode ? 0 : 1;
      params['end_time'] = this.end_time
      try {
        const res = await submit_game_setting(params);
        if (typeof res === 'string') {
          Notify({ type: 'danger', message: res });
          return
        }
      } catch (error) {
        return error;
      }
      //改变视图
      this.isLoading = !1;
      Notify({ type: 'success', message: '可以开始新游戏' })
      this.$emit('onShowOR')
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