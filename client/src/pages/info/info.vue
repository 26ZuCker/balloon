<template>
  <van-cell-group>
    <van-cell :title="`第${i}批`" v-for="i in allBatch" :key="i">
      <van-button
        custom-class="van-button--round"
        type="info"
        @tap="download(i)"
        >下载</van-button
      >
    </van-cell>
  </van-cell-group>
  <!--   </view> -->
</template>

<script>
/**
 * 缓存已请求的数据
 */
const hash = new Map()
import { getAllBatch, downloadExcel } from '@api/info.js'

export default {
  inheritAttrs: false,
  name: 'info',
  components: {},
  data: () => ({
    searchVal: '',
    current_round: '3',
    selectRoundList: null,
    allBatch: []
  }),
  props: {},
  methods: {
    /**
     * 防抖处理
     */
    onSearch () {

    },
    /**
     * 下载
     */
    async download (i) {
      const params = { batch: i }
      const res = await downloadExcel(params)
    }
  },
  async created () {
    this.allBatch = await getAllBatch()
  }
}
</script>

<style lang='scss' >
.van-button--round {
  border-radius: 999px !important;
}
</style>