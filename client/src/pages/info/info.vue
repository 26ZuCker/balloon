<template>
  <!--   <view>
    <van-search
      v-model="searchVal"
      input-align="center"
      shape="round"
      @change="onSearch"
      placeholder="请输入目标批次"
    >
      <slot-view name="actions" @tap="onSearch">搜索</slot-view>
    </van-search>
    <!--     <view class="rcc">
      <van-dropdown-menu>
        <van-dropdown-item :value="current_round" :options="round_num" />
      </van-dropdown-menu>
    </view> -->
  <van-cell-group>
    <van-cell
      :title="`第${i.round_count}批`"
      v-for="i in selectRoundList"
      :key="i.id"
    >
      <van-button
        custom-class="van-button--round"
        type="info"
        @tap="download(i.round_url)"
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

export default {
  inheritAttrs: false,
  name: 'info',
  components: {},
  data: () => ({
    searchVal: '',
    current_round: '3',
    selectRoundList: null,
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
    download (round_url) { }
  },
  computed: {
    round_num () {
      return [
        { text: '1-20', value: '1' },
        { text: '20-40', value: '2' },
        { text: '40-53', value: '3' },
      ]
    }
  },
  watch: {},
  async created () {
    //当前默认最新
    //this.current_round =
    this.selectRoundList = Object.freeze(
      [
        { round_count: 40, round_id: '40', round_url: '' },
        { round_count: 41, round_id: '41', round_url: '' },
        { round_count: 42, round_id: '42', round_url: '' },
        { round_count: 43, round_id: '43', round_url: '' },
        { round_count: 44, round_id: '44', round_url: '' },
        { round_count: 45, round_id: '45', round_url: '' },
        { round_count: 46, round_id: '46', round_url: '' },
        { round_count: 47, round_id: '47', round_url: '' },
        { round_count: 48, round_id: '48', round_url: '' },
        { round_count: 49, round_id: '49', round_url: '' },
        { round_count: 50, round_id: '50', round_url: '' },
        { round_count: 51, round_id: '51', round_url: '' },
        { round_count: 52, round_id: '52', round_url: '' },
        { round_count: 53, round_id: '53', round_url: '' },
      ]
    )
  }
}
</script>

<style lang='scss' >
.ccc {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.rcc {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.bg-grey {
  background-color: #dfdbdb;
}
.van-button--round {
  border-radius: 999px !important;
}
</style>