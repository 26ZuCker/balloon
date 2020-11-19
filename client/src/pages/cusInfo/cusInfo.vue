<template>
  <view style="height: 100%; width: 100%">
    <!-- 骨架屏等待 -->
    <van-skeleton title row="30" v-if="isSkeleton"></van-skeleton>
    <!-- 顶部通知条 -->
    <view v-else style="height: 100%; width: 100%">
      <User v-if="permission === 0"></User>
      <Setting v-else></Setting>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  inheritAttrs: false,
  name: 'cusInfo',
  components: {
    Setting: () => import('@com/cusInfo/Setting.vue'),
    User: () => import('@com/cusInfo/User.vue'),
  },
  data: () => ({
    isSkeleton: true,
  }),
  props: {},
  methods: {
    ...mapActions({
      login: 'user/login'
    })
  },
  computed: {
    ...mapState({
      permission: (state) => state.permission
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
    /* this.currentTime = new Date().getTime()
    this.end_time = new Date().getTime() */
    await this.login()
    //const bool = this.permission === 0
    //填写的模板
    //this.form = bool ? this.getUserInfoTemplate() : this.getGameSettingTemplate()
    this.isSkeleton = false
  }
}
</script>

<style lang='scss' >
@import url("./cusInfo.scss");
</style>