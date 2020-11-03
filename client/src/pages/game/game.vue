<template>
  <view class="ccc">
    <!-- 顶部提示语 -->
    <view>{{ title }}</view>
    <!-- 气球主体，建议限制高度为百分比 -->
    <view class="img-container">
      <image :style="imgStyle" mode="aspectFill" :src="balloon_src"></image>
    </view>
    <!-- 状态单元格 -->
    <van-cell-group>
      <van-cell title="单元格" value="内容" />
    </van-cell-group>
    <!-- 按钮组 -->
    <view class="rac">
      <van-button round type="primary" @click="blow">充气</van-button>
      <van-button round type="info" @click="accountReceive">收账</van-button>
    </view>
  </view>
</template>

<script>
import { } from '@/apis/game'
import balloon from '@/img/balloon.svg'

//注意：与渲染无关的变量尽量不要存在data内
const leftCheckpoint = 30
const mode = ''
const maxCount = Number.MAX_SAFE_INTEGER

export default {
  inheritAttrs: false,
  name: 'game',
  components: {},
  data: () => ({
    //标题
    title: '',
    //气球图片
    balloon_src: balloon,
    //点击次数
    count: 0,
  }),
  props: {},
  methods: {
    blow () {
      this.count += 1
    },
    accountReceive () { }
  },
  computed: {
    imgStyle () {
      const width = this.count * 10 + 10
      const height = this.count * 8 + 10
      return `width: ${width}px; height: ${height}px; background-color: #eeeeee`
    }
  },
  watch: {},
  //接收参数判断当前模式是练习还是正式
  async created () {
    //this.leftCheckpoint = mode === 'FORMAL' ? 30 : 2
  }
}
</script>

<style lang='scss'>
.ccc {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.rac {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-around;
}
.img-container {
  height: 300px;
  width: 100%;
}
</style>