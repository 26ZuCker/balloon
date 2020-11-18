<template>
  <view>
    <!-- 顶部消息框 -->
    <van-notify id="van-notify"></van-notify>
    <van-skeleton title row="15" v-if="isSkeleton"></van-skeleton>
    <!-- 后续进行长列表优化 -->
    <van-cell-group v-else>
      <van-cell :title="`第${i}批`" v-for="i in allBatch" :key="i">
        <van-button
          v-if="!hasUrl(i)"
          custom-class="van-button--round"
          type="info"
          :loading="isDownloading(i)"
          @tap="download(i)"
          >下载</van-button
        >
        <view v-else>{{ excelUrl(i) }}</view>
      </van-cell>
    </van-cell-group>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'

import Notify from '@com/vant-weapp/dist/notify/notify.js';
import { get_all_batch, download_excel } from '@api/info.js'
/**
 * 缓存已请求的数据长列表
 */
const hash = new Map()
const allBatch = []
export default {
  inheritAttrs: false,
  name: 'info',
  components: {},
  data: () => ({
    viewBatch: [],
    isSkeleton: true,
  }),
  props: {},
  methods: {
    /**
     * 防抖处理
     */
    onSearch () { },
    /**
     * 下载
     */
    async download (i) {
      if (hash.has(i)) {
        hash.set(i, { path: hash.get(i).path, isDownloading: false })
      }
      //如果不存在则重新获取
      else {
        hash.set(i, { path: '', isDownloading: true })
        //如果存在
        const params = { batch: i }
        const res = await download_excel(params)
        const { path } = res
        hash.set(i, { path, isDownloading: false })
      }
      Notify({ type: 'primary', message: '复制左侧链接至浏览器以下载excel' })
      //清除isDownloading以GC因为不会再使用
      hash.set(i, { path, isDownloading: null })
    }
  },
  computed: {
    /**
     * 判断是否已获取过下载链接
     */
    hasUrl () {
      return function (i) {
        return hash.has(i) && hash.get(i).path !== ''
      }
    },
    /**
     * 返回下载链接字符串
     */
    excelUrl () {
      return function (i) {
        return hash.has(i) ? hash.get(i).path : '不存在'
      }
    },
    /**
     * 判断是否在点击下载中，默认为false
     */
    isDownloading () {
      return function (i) {
        return hash.get(i).isDownloading || false
      }
    }
  },
  async created () {
    const res = await get_all_batch()
    this.viewBatch = Object.freeze(res)
    this.isSkeleton = false
  }
}
</script>

<style lang='scss' >
.van-button--round {
  border-radius: 999px !important;
}
</style>