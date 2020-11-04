<template>
  <view class="ccc">
    <van-cell-group>
      <van-field
        :value="userInfo.i"
        required
        clearable
        :label="i.title"
        :placeholder="placeholderTitle(i.title)"
        v-for="i in userInfo"
        :key="i.title"
      ></van-field>
    </van-cell-group>
    <van-button
      custom-class="van-button--round van-button--large"
      type="primary"
      :loading="isLoading"
      @tap="submit_userInfo"
      >提交</van-button
    >
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { get_userInfo_template, submit_userInfo } from '@/apis/user.js'

export default {
  inheritAttrs: false,
  name: '',
  components: {},
  data: () => ({
    userInfo: null,
    isLoading: false
  }),
  props: {},
  methods: {
    /**
     * 建议进入前根据传入一个状态值判断当前用户是否已填写过该表格避免重复填写
     */
    async get_userInfo_template () {
      try {
        const { code, data } = (await get_userInfo_template()).data
        if (code !== this.cusResCode.ERROR) {
          this.userInfo = data.userInfo
          return Promise.resolve()
        } else {
          return Promise.reject('http fail')
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async submit_userInfo () {
      this.isLoading = true
      Taro.navigateTo({
        url: '../game/game',
      })
      try {
        const { code, data } = (await submit_userInfo()).data
        if (code !== this.cusResCode.ERROR) {
          //this.userInfo = data.userInfo
          this.isLoading = false
          return Promise.resolve()
        } else {
          this.isLoading = false
          return Promise.reject('http fail')
        }
      } catch (error) {
        this.isLoading = false
        return Promise.reject(error)
      }
    }
  },
  computed: {
    placeholderTitle () {
      return function (title) {
        return `请输入${title}`
      }
    }
  },
  watch: {},
  async created () {

  }
}
</script>

<style lang='scss' >
.van-button--round {
  border-radius: 999px !important;
}
.van-button--large {
  width: 100px !important;
  height: 50px !important;
}
.ccc {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>