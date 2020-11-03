<template>
  <view class="ccc">
    <view>{{ title }}</view>
    <img />
    <van-cell-group>
      <van-cell title="单元格" value="内容" />
    </van-cell-group>
    <view class="rac">
      <van-button round type="primary" @click="blow">充气</van-button>
      <van-button round type="info" @click="accountReceive">收账</van-button>
    </view>
  </view>
</template>

<script>
import { } from '@/apis/game'

export default {
  inheritAttrs: false,
  name: 'game',
  components: {},
  data: () => ({
    title: '',
    img_src: null,
  }),
  props: {},
  methods: {
    blow () { },
    accountReceive () { }
  },
  computed: {},
  watch: {},
  async created () {

  }
}
</script>

<style lang='scss'>
</style>