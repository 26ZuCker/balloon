<template>
  <view style="height: 100%; width: 100%">
    <van-toast id="van-toast" />
    <!-- 顶部消息框 -->
    <van-dialog id="van-dialog" />
    <van-skeleton title row="30" v-if="isSkeleton"></van-skeleton>
    <!-- 后续进行长列表优化 -->
    <view
      v-if="viewBatch.length === 0 && !isSkeleton"
      style="height: 100%; width: 100%"
    >
      <view style="font-size: 30px; font-weight: 400" class="ccc"
        >暂无数据</view
      >
    </view>
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
//Gdut123456@
import Taro from '@tarojs/taro'
import Dialog from '@com/vant-weapp/dist/Dialog/Dialog.js';
import Toast from '@com/vant-weapp/dist/toast/toast.js';
import { get_all_batch, download_excel } from '@api/info.js'
/**
 * 缓存已请求的数据长列表
 */
const hash = new Map()
/**
 * 已请求的url
 */
let viewUrl = []
export default {
  inheritAttrs: false,
  name: 'info',
  data: () => ({
    /**
     * 可视区内所有
     */
    viewBatch: [],
    isSkeleton: true,
    isDialog: false,
  }),
  props: {},
  methods: {
    /**
     * 响应点击下载按钮
     */
    async download (i) {
      const errCb = (error) => {
        Toast.clear()
        Toast(error + '网络请求出错');
      }

      /*       if (viewUrl[i] !== '') {
              console.log('err')
              console.log(viewUrl)
              this.showDialog(viewUrl[i])
              return
            } */

      Toast.loading({
        message: '获取中',
        forbidClick: true,
        loadingType: 'spinner',
      });

      //获取
      try {
        const res = await download_excel({ batch: i })
        console.log(res)
        if (typeof res === 'string') {
          errCb()
          return
        }
        const { path } = res
        viewUrl[i] = path
        Toast.clear()
        this.showDialog(path)
      } catch (error) {
        errCb(error)
      }
    },
    /**
     * 展示弹窗
     */
    showDialog (path) {
      Dialog.alert({
        title: '复制链接至浏览器以下载excel',
        message: path,
        confirmButtonText: '复制链接至剪贴板',
        showCancelButton: true,
        cancelButtonText: '取消'
      }).then(() => {
        //复制至剪贴板
        Taro.setClipboardData({
          data: path,
          success: function (res) {
            Taro.getClipboardData({
              success: function (res) { }
            })
          }
        })
        //关闭
        Dialog.close()
      });
    }
  },
  computed: {
    /**
     * 返回下载链接字符串
     */
    excelUrl () {
      return function (i) {
        return viewUrl[i] === '' ? '不存在' : viewUrl[i]
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
    try {
      const res = await get_all_batch()
      this.viewBatch = Object.freeze(res)
      viewUrl = Array(this.viewBatch.length + 1).fill('')
    } catch (error) {
      this.viewBatch.length = 0
      viewUrl.length = 0
    } finally {
      this.isSkeleton = false
    }
  }
}
</script>

<style lang='scss' >
.van-button--round {
  border-radius: 999px !important;
}
.ccc {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>