<template>
  <view style="height: 100%">
    <!-- 顶部通知条 -->
    <van-notify id="van-notify" />
    <!-- 顶部提示语 -->
    <van-notice-bar
      color="#1989fa"
      background="#ecf9ff"
      left-icon="info-o"
      :text="titleNotice"
    ></van-notice-bar>
    <!-- 气球主体，建议限制高度为百分比 -->
    <view class="img-container">
      <image
        :style="imgStyle"
        mode="aspectFit"
        v-if="isBombing"
        :src="bomb"
      ></image
      ><image :style="imgStyle" mode="aspectFit" v-else :src="balloon"></image>
    </view>
    <!-- 状态单元格 -->
    <van-cell-group>
      <van-cell
        class="statistic-main"
        v-for="i in statistics"
        :key="i.title"
        :title="i.title"
        :value="i.value"
      ></van-cell>
    </van-cell-group>
    <!-- 按钮组 -->
    <view class="rac">
      <van-button
        custom-class="van-button--round van-button--large"
        :type="isBombing ? 'warning' : 'primary'"
        @tap="blow"
        >{{ isBombing ? "下一轮" : "充气" }}</van-button
      >
      <van-button
        custom-class="van-button--round van-button--large"
        type="info"
        @tap="accountReceive"
        >收账</van-button
      >
    </view>
    <!-- 该组件只需要负责展示以及反馈点击了哪个按钮即可 -->
    <Dialog
      @onConfirm="confirmDialog"
      :isDialog="isDialog"
      :waitingSecond="waitingSecond"
      :contentMsg="contentMsg"
      :confirmBtnText="confirmBtnText"
      :showBtn="showBtn"
    ></Dialog>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';
import { mapState, mapGetters } from 'vuex'
//图片
import balloon from '@img/balloon.jpg'
import bomb from '@img/bomb.jpg'
//组件
import Dialog from '@com/common/Dialog.vue';
import Notify from '@com/vant-weapp/dist/notify/notify.js';
//api
import { submit } from '@api/game.js'
//hook
import { blow, accountReceive, showDialog, confirmDialog } from './hook/view.js'
import { changeMode, changeProps, takeStatistics, iniOptionalMode, optionalMode, statics_template } from './hook/model.js'
/**
 * 爆破点
 */
const blast_point_list = []
export default {
  inheritAttrs: false,
  name: 'game',
  components: { Dialog: Dialog },
  data: () => ({
    //点击次数
    count: 0,
    //与视图变化有关的数据
    isBombing: !1,
    isSubmitting: !1,
    isDialog: !1,
    waitingSecond: 2000,
    //需要传给子组件的props
    contentMsg: '',
    confirmBtnText: '',
    //所需收集的数据
    statistics: null,
    showBtn: !0,
    mode: ''
  }),
  methods: {
    blow () {
      blow.call(this, ...arguments)
    },
    accountReceive () {
      accountReceive.call(this, ...arguments)
    },
    changeMode () {
      changeMode.call(this, ...arguments)
    },
    changeProps () {
      changeProps.call(this, ...arguments)
    },
    iniOptionalMode () {
      iniOptionalMode.call(this, ...arguments)
    },
    takeStatistics () {
      takeStatistics.call(this, ...arguments)
    },
    showDialog () {
      showDialog.call(this, ...arguments)
    },
    confirmDialog () {
      confirmDialog.call(this, ...arguments)
    },
    /**
     * 重新开始当前该用户当前批次的游戏，不必清空整个统计数据而只重置剩余关卡，不改变模式
     */
    restart () {
      this.count = 0
      //this.statistics = statics_template
      this.statistics.left_checkpoint.value = 30
    },
    /**
     * 统计信息文本化，后期需要修改即只有当结束游戏时才会进行computed否则这会一直更新缓存
     */
    statisticsMsg () {
      return this.mode === 'TRAIN' ? [`${this.train_dialog}`]
        : (this.mode === 'PERSON' ? [`${this.game_dialog}`] : this.statistics)
    }
  },
  computed: {
    balloon () { return balloon },
    bomb () { return bomb },
    /**
     * 图片大小改变
     */
    imgStyle () {
      const width = this.count * 8 + 100
      const height = this.count * 5 + 100
      return `width: ${width}px; height: ${height}px`
    },
    /**
     * 顶部标题
     */
    titleNotice () {
      return this.mode === '' ? '' : optionalMode[this.mode].title
    },
    ...mapState({
      train_dialog: (state) => state.game.train_dialog,
      game_dialog: (state) => state.game.game_dialog,
      round1_notice: (state) => state.game.round1_notice,
      round2_notice: (state) => state.game.round2_notice,
      personOnGroup: (state) => state.game.personOnGroup,
      blast_point_list: (state) => state.game.blast_point_list,
    }),
  },
  async created () {
    this.statistics = statics_template;
    this.changeMode()
    //初始化先进行两轮练习
    this.showDialog()
    //初始化optionmode
    this.iniOptionalMode(this.personOnGroup)
  },
  beforeDestroy () {

  }
}
</script>

<style lang='scss'>
@import url("./game.scss");
</style>