<template>
  <view style="height: 100%; width: 100%">
    <!-- 顶部消息框 -->
    <!-- <van-notify id="van-notify" /> -->
    <van-dialog id="van-dialog" />
    <van-skeleton title row="30" v-if="isSkeleton"></van-skeleton>
    <!-- 后续进行长列表优化 -->
    <van-cell-group v-else>
      <van-cell :title="`第${i}批`" v-for="i in viewBatch" :key="i">
        <van-button
          custom-class="van-button--round"
          type="info"
          @tap="download(i)"
          >下载</van-button
        >
      </van-cell>
    </van-cell-group>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import Dialog from '@com/vant-weapp/dist/Dialog/Dialog.js';
import { get_all_batch, download_excel } from '@api/info.js'
/**
 * 缓存已请求的数据长列表
 */
const hash = new Map()
const allBatch = []
export default {
  inheritAttrs: false,
  name: 'info',
  data: () => ({
    viewBatch: [],
    isSkeleton: true,
    viewUrl: null,
    isDialog: false,
    contentMsg: ''
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
      /*       let path
            if (hash.has(i)) {
              hash.set(i, { path: hash.get(i).path, isDownloading: false })
            }
            //如果不存在则重新获取
            else {
              hash.set(i, { path: '', isDownloading: true })
              //如果存在
              const params = { batch: i }
              const res = await download_excel(params)
              path = res.path
              this.viewUrl[i] = path
              hash.set(i, { path: path, isDownloading: false })
            }
            Notify({ type: 'primary', message: '复制左侧链接至浏览器以下载excel', selector: '#van-notify', })
            //清除isDownloading以GC因为不会再使用
            hash.set(i, { path: path, isDownloading: null }) */
      const params = { batch: i }
      const res = await download_excel(params)
      const path = res.path
      this.viewUrl[i] = path
      Dialog.alert({
        title: '复制链接至浏览器以下载excel',
        message: path,
        confirmButtonText: '复制链接至您的剪贴板',
      }).then(() => {
        Taro.setClipboardData({
          data: path,
          success: function (res) {
            Taro.getClipboardData({
              success: function (res) {
                console.log(res)
              }
            })
          }
        })
        Dialog.close()
      });
    }
  },
  computed: {
    /**
     * 判断是否已获取过下载链接
     */
    hasUrl () {
      return function (i) {
        //return hash.has(i) && hash.get(i).path !== ''
        return this.viewUrl[i] !== ''
      }
    },
    /**
     * 返回下载链接字符串
     */
    excelUrl () {
      return function (i) {
        //return hash.has(i) ? hash.get(i).path : '不存在'
        return this.viewUrl[i] === '' ? '不存在' : this.viewUrl[i]
      }
    },
    /**
     * 判断是否在点击下载中，默认为false
     */
    isDownloading () {
      return function (i) {
        return hash.get(i)?.isDownloading || false
      }
    }
  },
  async created () {
    const res = await get_all_batch()
    this.viewBatch = Object.freeze(res)
    this.viewUrl = Array(this.viewBatch.length + 1).fill('')
    this.isSkeleton = false
  }
}
</script>

<style lang='scss' >
.van-button--round {
  border-radius: 999px !important;
}
</style>