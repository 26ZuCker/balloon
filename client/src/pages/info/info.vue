<template>
  <view>
    <van-skeleton title row="15" v-if="isSkeleton"></van-skeleton>
    <van-cell-group v-else>
      <van-cell :title="`第${i}批`" v-for="i in allBatch" :key="i">
        <van-button
          custom-class="van-button--round"
          type="info"
          @tap="download(i)"
          >下载</van-button
        >
      </van-cell>
    </van-cell-group>
  </view>

  <!--   </view> -->
</template>

<script>
import Taro from '@tarojs/taro'
/**
 * 缓存已请求的数据
 */
const hash = new Map()
import { get_all_batch, download_excel } from '@api/info.js'

export default {
  inheritAttrs: false,
  name: 'info',
  components: {},
  data: () => ({
    searchVal: '',
    current_round: '3',
    selectRoundList: null,
    allBatch: [],
    isSkeleton: true,
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
      const res = await download_excel(params)
      const { path } = res
      Taro.downloadFile({
        url: path,
        success: function (res) {
          console.log(res)
        },
        fail: function (error) {
          console.log(error)
        }
      });
    }
  },
  async created () {
    this.allBatch = await get_all_batch()
    this.isSkeleton = false
  }
}
</script>

<style lang='scss' >
.van-button--round {
  border-radius: 999px !important;
}
</style>