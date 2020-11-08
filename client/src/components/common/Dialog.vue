<template>
  <van-dialog
    theme="round-button"
    :title="dialogTitle"
    :message="contentMsg"
    :show="isDialog"
    :confirm-button-text="confirmBtnText"
    :confirm-button-color="confirmBtnColor"
    @confirm="onConfirm"
  >
  </van-dialog>
</template>
<script>

export default {
  inheritAttrs: false,
  name: 'Dialog',
  props: {
    isDialog: { type: Boolean, default: false },
    /**
     * 等待20或15s才能点击按钮
     */
    waitingSecond: { type: Number, default: 0 },
    //以下为展示的具体内容
    contentMsg: { type: String, default: '' },
    confirmBtnText: { type: String, default: '' },
    dialogTitle: { type: String, default: '' },
  },
  data: () => ({
    currentSecond: 0
  }),
  computed: {
    confirmBtnColor () {
      return this.currentSecond === 0 ? '#ee0a24' : '#dededebb'
    }
  },
  methods: {
    onClose () {
      if (this.currentSecond === 0) {
        this.$emit('onClose')
      }
    },
    onConfirm () {
      if (this.currentSecond === 0) {
        this.$emit('onConfirm')
      }
    },
    showSelf () {
      const timer = setTimeout(() => {
        this.currentSecond = 0
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
}
</script>