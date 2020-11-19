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
      permission: (state) => state.user.permission
    })
  },
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