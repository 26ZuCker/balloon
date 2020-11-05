<template>
  <view>
    <view class="rcc">
      <van-search
        v-model="searchVal"
        input-align="center"
        shape="round"
        @change="onSearch"
        placeholder="请输入目标批次"
      >
        <slot-view name="actions" @tap="onSearch">搜索</slot-view>
      </van-search>
      <van-dropdown-menu>
        <van-dropdown-item :value="current_round" :options="round_num" />
      </van-dropdown-menu>
    </view>
    <van-cell-group>
      <van-cell
        :title="`第${i.round_count}批`"
        v-for="i in selectRoundList"
        :key="i.id"
      >
        <van-button plain type="info" @tap="download(i.round_url)"
          >下载</van-button
        >
      </van-cell>
    </van-cell-group>
  </view>
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
    current_round: '',
    selectRoundList: [
      { round_count: 1, round_id: '1', round_url: '' },
      { round_count: 2, round_id: '2', round_url: '' },
    ]
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
      return [1, 2, 3]
    }
  },
  watch: {},
  async created () {
    //当前默认最新
    //this.current_round =
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
</style>