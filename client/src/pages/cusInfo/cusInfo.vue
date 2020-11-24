<template>
  <view style="height: 100%; width: 100%">
    <!-- 骨架屏等待 -->
    <van-skeleton title row="30" v-if="isSkeleton"></van-skeleton>
    <!-- 顶部通知条 -->
    <User v-else></User>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import User from '@com/cusInfo/User.vue'
export default {
  inheritAttrs: false,
  name: 'cusInfo',
  components: {
    User: User
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
  mounted () {
    this.isSkeleton = false
  }
}
</script>

<style lang='scss' >
@import url("./cusInfo.scss");
</style>