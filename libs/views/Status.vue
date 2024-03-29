<template>
  <div id="status">
    <single-page-header title="状态" sub-title="最近24小时爬虫服务状态" />
    <div class="container">
      <div class="row">
        <div v-for="(row, order) in itemRows" :key="order" class="col-md-12">
          <tmv2-chart :chart-rows="row" :colors="color[order]" :label-map="labelMap[order]" chart-type="line"></tmv2-chart>
        </div>
      </div>
      <div class="my-4"></div>
      <div class="text-center">
        <el-button circle @click="$router.go(-1)"><arrow-left height="1em" status="" width="1em"/></el-button>
      </div>
      <div class="my-4"></div>
    </div>
    <div class="text-center" style="height: 30px">
      NEST.MOE
    </div>
    <transition name="el-fade-in">
      <div class="el-backtop" style="right: 40px; bottom: 90px; z-index: 1500" @click="getStatus">
        <arrow-clockwise height="1em" status="" width="1em" :class="{'animate-spin': state.updating}" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import Tmv2Chart from "../components/Charts/Tmv2ChartWithoutDataSet.vue"
import {computed, defineComponent, onMounted, reactive, Ref, ref, toRefs} from "vue"
import {useHead} from "@vueuse/head"
import ArrowLeft from "../icons/ArrowLeft.vue"
import SinglePageHeader from "../components/SinglePageHeader.vue"
import {Status} from "../types/Content"
import {useStore} from "../store"
import {request} from "../share/Fetch"
import {ApiStatusLegacy} from "../types/Api"
import {Notice} from "../share/Tools"
import ArrowClockwise from "../icons/ArrowClockwise.vue";

useHead({
  title: '状态',
  meta: [{name: "theme-color", content: "#1da1f2"}]
})

const state = reactive<{
  rows: Ref<Status[]>
  updating: boolean
}>({
  rows: ref([]),
  updating: false
})

const labelMap = {
  account: {'time': '日期', 'total_users': '帐号数',},
  tweets: {'time': '日期', 'total_media_count': '总媒体数', 'total_tweets': '推文数', 'total_req_tweets': '处理推文数', 'total_throw_tweets': '丢弃推文数',},
  requests: {'time': '日期', 'total_req_times': '总请求数', 'total_errors_count': '总失败数',},
  timeCount: {'time': '日期', 'total_time_cost': '总耗时',}
}

const color = {
  account: ['#19d4ae'],
  tweets: ['#5ab1ef', '#fa6e86', '#ffb980', '#c4b4e4'],
  requests: ['#0067a6', '#5ab1ef'],
  timeCount: ['#d87a80'],
}

const store = useStore()
const settings = computed(() => store.state.settings)

onMounted(() => {
  getStatus()
})
const getStatus = () => {
  state.updating = true
  request<ApiStatusLegacy>(settings.value.basePath + '/api/v3/data/status/').then(response => {
    state.rows = response.data
    if (!state.rows.length) {
      Notice("chart: " + response.message, "warning");
    }
    state.updating = false
  }).catch((e: Error) => {
    Notice(String(e), "error")
    state.updating = false
  })
}
const itemRows = computed(() => {
  let tmpItemRows = reactive<{
    account: {time: string; total_users: number}[]
    tweets: { time: string; total_tweets: number; total_req_tweets: number; total_throw_tweets: number; total_media_count: number; }[]
    requests: { time: string; total_req_times: number; total_errors_count: number; }[]
    timeCount: {time: string; total_time_cost: number; }[]
  }>({
    account: [],
    tweets: [],
    requests: [],
    timeCount: []
  })
  state.rows.map(x => {
    let date = new Date(x.time * 1000)
    let time = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0') + ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
    tmpItemRows.account.push({time: time, total_users: x.total_users})
    tmpItemRows.tweets.push({
      time: time,
      total_tweets: x.total_tweets,
      total_req_tweets: x.total_req_tweets,
      total_throw_tweets: x.total_throw_tweets,
      total_media_count: x.total_media_count
    })
    tmpItemRows.requests.push({
      time: time,
      total_req_times: x.total_req_times,
      total_errors_count: x.total_errors_count
    })
    tmpItemRows.timeCount.push({time: time, total_time_cost: x.total_time_cost})
  })
  return tmpItemRows
})

</script>

<style scoped>

</style>
