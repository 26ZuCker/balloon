<template>
  <view style="height: 100%; width: 100%">
    <!-- 顶部消息框 -->
    <van-notify id="van-notify" />
    <van-divider
      contentPosition="center"
      customStyle="color: #1989fa; border-color: #1989fa; font-size: 18px;"
    >
      请填写你的个人信息
    </van-divider>
    <!-- 顶部提示语 -->
    <view v-for="(i, key) in form" :key="i.title">
      <view class="rsc" style="width: 100%">
        <view
          style="
            color: #1989fa;
            font-size: 25px;
            font-weight: 200;
            margin-right: 10px;
            width: 13%;
          "
          >{{ i.title }}</view
        >
        <input
          style="width: 87%"
          :maxlength="-1"
          type="text"
          :placeholder="placeholderTitle(i.title)"
          @input="onInput(key, $event)"
        />
      </view>
      <van-divider dashed />
    </view>
    <view class="ccc">
      <van-button
        custom-class="van-button--round van-button--large ma-3"
        type="primary"
        :loading="isLoading"
        @tap="submitChange"
        >提交</van-button
      >
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { mapMutations } from 'vuex'
//工具函数
import { debounce } from '@util/HOC'

import validate from '@util/validate'
//视图
import Notify from '@com/vant-weapp/dist/notify/notify.js';
//参与者
import { get_userInfo_template } from '@api/user.js';
//预加载配置
import { get_game_settings, _update, _submit } from '@api/game';
export default {
  inheritAttrs: false,
  name: 'User',
  components: {
  },
  data: () => ({
    //表单
    form: null,
    //视图
    isLoading: false,
  }),
  methods: {
    /**
     * 监听表单输入，后期注意防抖
     */
    onInput (key, $event) {
      const cb = () => { this.form[key].value = $event.detail.value; }
      return debounce(cb)()
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
      this.submitUserInfo();
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
    ...mapMutations(
      { setSettings: 'game/setSettings', setUserInfo: 'user/setUserInfo' }
    ),
  },
  computed: {
    /**
     * 输入框提示文字
     */
    placeholderTitle () {
      return function (title) {
        return title === '评分' ? '请您为自己在班级中的地位打分，满分为100' : `请输入${title}`
      }
    },
  },
  mounted () {
    this.form = this.getUserInfoTemplate()
  }
}
</script>