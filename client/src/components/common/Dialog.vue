<template>
  <van-overlay :show="isDialog">
    <view
      class="page-y-center page-x-center ccc bg-white text-black border"
      style="width: 60%; padding: 20px"
    >
      <!-- 主体tip -->
      <view v-for="i in contentMsg" :key="i.title">
        {{ content(i) }}
      </view>
      <!-- 底部关闭按钮 -->
      <van-button
        v-if="showBtn"
        :type="btnColor"
        custom-class="van-button--round van-button--large"
        :loading="currentSecond !== 0"
        @tap="onConfirm"
        >确认</van-button
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
    showBtn: { type: Boolean, default: !0 },
    /**
     * 等待20或15s才能点击按钮
     */
    waitingSecond: { type: Number, default: 0 },
    //以下为展示的具体内容
    contentMsg: [Object, Array],
    //当前模式，用于判断是否为正式模式的所有关卡结束
    current_mode: { type: String },
  },
  data: () => ({
    //dialog内部属性，默认20s
    currentSecond: 2000
  }),
  computed: {
    btnColor () {
      if (this.current_mode === 'personal') {
        return 'danger'
      }
      return this.currentSecond === 0 ? 'primary' : 'info'
    },
    /**
     * 主体内容，可能传入字符串数组或对象
     */
    content () {
      return function (i) {
        return typeof i === 'string' ? i : `${i.title} : ${i.value}`
      }
    }
  },
  methods: {
    /**
     * 响应确认
     */
    onConfirm () {
      if (this.currentSecond === 0) {
        this.$emit('onConfirm')
      }
    },
    /**
     * 定时展示关闭按钮
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
      }, immediate: !0
    },
    isDialog (n) {
      this.showSelf()
    },
  },
  created () {
    this.showSelf()
  }
}
</script>
<style lang="scss">
.border {
  border-radius: 5%;
}
.van-button--round {
  border-radius: 999px !important;
}
.van-button--large {
  width: 130px !important;
  height: 50px !important;
}
.page-y-center {
  position: relative;
  top: 20%;
  transform: translateY(50%);
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