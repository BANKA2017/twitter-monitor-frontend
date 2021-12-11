<template>
  <div id="staff-candle-stick-page">
    <div class="jumbotron jumbotron-fluid" style="background-color: #1da1f2">
      <div class="container">
        <h1 class="display-4" style="color: white"><del>部分</del>官推数据</h1>
        <p class="lead" style="color: white">以后可能会合并到 <router-link to="/i/trends/" style="color: white; ">Trends</router-link>，届时适用于全部账号</p>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-3 order-md-0 order-1">
          <template v-for="(userList, groupName) in staffList" :key="groupName">
            <p class="lead">{{ groupName }}</p>
            <div class="list-group mb-3">
              <div role="button" :class="{'list-group-item': true, 'active': user === activeStaff}" v-for="user in userList" :key="user" @click="activeStaff = user">
                {{ user }}
              </div>
            </div>
          </template>
          <div class="text-center my-4"> >_ Twitter Monitor</div>
        </div>
        <div class="col-md-9 order-md-1 order-0">
          <p class="text-center lead" v-if="lock">请选择一个 STAFF 账号</p>
          <div v-else>
            <candlestick-chart height="500px" :set-option="{notMerge: false}" :data-array="candleData.series" :x-axis-data="candleData.date" title="关注数K线图" :zoom="true" :ma_line="true"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CandlestickChart from "@/components/modules/candlestickChart";
import {mapState} from "vuex";
import {inject} from "vue";
import {useHead} from "@vueuse/head";
export default {
  name: "staffCandleStickPage",
  setup () {
    useHead({
      title: "部分官推数据",
      meta: [{
        name: "theme-color",
        content: "#1da1f2"
      }]
    })
    const notice = inject('notice')
    return {
      notice
    }
  },
  components: {CandlestickChart},
  data: () => ({
    staffList: {
      "BanG Dream!": [
        "bang_dream_info",
        "bang_dream_gbp",
        "bangdreamgbp_EN",
      ],
      "LoveLive!": [
        "LoveLive_staff",
        "lovelive_SIF",
        "LLAS_STAFF",
      ],
      "227": [
        "227_staff",
        "nanaon_official",
        "227keisanchu"
      ]
    },
    activeStaff: "",
    activeData: {},
    lock: true,
  }),
  computed: mapState({
    settings: 'settings',
    candleData: function () {
      let tmpCandleData = {
        date: [],
        series: [],
      }
      if (this.activeData !== {}) {
        //date
        tmpCandleData.date = Object.keys(this.activeData.followers)
        //followers
        tmpCandleData.series = tmpCandleData.date.map(x => ([
          this.activeData.followers[x].start,
          this.activeData.followers[x].end,
          this.activeData.followers[x].highest,
          this.activeData.followers[x].lowest,
        ]))
        tmpCandleData.date = tmpCandleData.date.map(x => {
          let tmpX = [...(x + '')]
          return tmpX.splice(0, 4).join('') +'-'+ tmpX.splice(0, 2).join('') +'-'+ tmpX.join('')
        })
      }
      return tmpCandleData
    }
  }),
  watch: {
    "activeStaff": function () {
      this.fetchData()
    }
  },
  methods: {
    fetchData: function () {
      fetch(this.settings.data.basePath + (process.env.NODE_ENV === "development" ? '/proxy.php?filename=staff_data&name=' + this.activeStaff : '/static/trends/' + this.activeStaff + '.json')).then(async response => {
        //status.userOrder = -1
        this.activeData = (await response.json()).data
        this.lock = false
      }).catch(e => this.notice(e, 'error'))
    }
  }
}
</script>

<style scoped>

</style>
