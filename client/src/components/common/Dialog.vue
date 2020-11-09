<template>
  <!--   <van-dialog
    theme="round-button"
    :title="dialogTitle"
    :message="contentMsg"
    :show="isDialog"
    :confirmButtonText="confirmBtnText"
    show-cancel-button
    @confirm="onConfirm"
    @cancel="onClose"
    :asyncClose="isSubmitting"
  >
  </van-dialog>
 -->
  <van-overlay :show="isDialog">
    <view
      class="page-y-center page-x-center ccc bg-white text-black van-button--round"
      style="width: 60%; padding: 20px"
    >
      <view class="">
        {{ contentMsg }}
      </view>
      <van-button
        :type="btnColor"
        custom-class="van-button--round van-button--large"
        :loading="currentSecond !== 0"
        @tap="onConfirm"
        >{{ confirmBtnText }}</van-button
      >
    </view>
  </van-overlay>
</template>
<script>

export default {
  inheritAttrs: false,
  name: 'Dialog',
  props: {
    isDialog: { type: Boolean, default: false },
    isSubmitting: { type: Boolean, default: false },
    /**
     * 等待20或15s才能点击按钮
     */
    waitingSecond: { type: Number, default: 0 },
    //以下为展示的具体内容
    contentMsg: { type: String, default: '' },
    confirmBtnText: { type: String, default: '' },

  },
  data: () => ({
    //dialog内部属性，默认20s
    currentSecond: 20000
  }),
  computed: {
    /*     isShow () {
          console.log(this.currentSecond === 0)
          return this.currentSecond === 0 ? '' : '#ee0a24'
        } */
    btnColor () {
      return this.currentSecond === 0 ? 'primary' : 'info'
    }
  },
  methods: {
    /**
     * 响应关闭
     */
    /*     onClose () {
          if (this.currentSecond === 0) {
            this.$emit('onClose')
          } else {
            console.log('no confirm')
          }
        }, */
    /**
     * 响应确认
     */
    onConfirm () {
      if (this.currentSecond === 0) {
        this.$emit('onConfirm')
      } else {
        console.log('no confirm')
      }
    },
    /**
     * 
     */
    showSelf () {
      this.currentSecond = this.waitingSecond
      const timer = setTimeout(() => {
        this.currentSecond = 0
        console.log('over')
      }, this.currentSecond)
      this.$on('beforeDestroy', () => {
        clearTimeout(timer)
      })
    }
  },
  watch: {
    /**
     * 如果传入的参数发生改变，立即执行一遍
     */
    waitingSecond: {
      handler (n) {
        this.currentSecond = n
      }, immediate: true
    },
    isDialog (n) {
      this.showSelf()
    }
  },
  created () {
    this.showSelf()
  }
}
</script>
<style lang="scss">
.van-button--round {
  border-radius: 999px !important;
}
.van-button--large {
  width: 130px !important;
  height: 50px !important;
}
.page-y-center {
  position: relative;
  top: 30%;
  transform: translateY(-30%);
}
@mixin md($direction, $justify-content) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify-content;
  align-items: center;
}
.ccc {
  @include md(column, center);
}
.bg-white {
  background-color: #ffffff;
}
.text-black {
  color: #000000;
}
.page-x-center {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>