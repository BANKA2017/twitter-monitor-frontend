<template>
  <div id="trends-account" >
    <div class="container">
      <div class="row">
        <div class="col-md-10 offset-md-1 mb-5">
            <h3 class="display-6">K线图</h3>
            <p class="lead">{{state.activeAccount}}</p>
            <candlestick-chart height="500px" :set-option="{notMerge: false}" :data-array="candleData.series" :x-axis-data="candleData.date" title="关注数K线图" :zoom="true" :ma_line="true"/>
            <h5 class="text-muted small">账号列表 ({{nameList.length}})</h5>
            <!--<span v-for="account in nameList" :key="account"><el-tag class="text-decoration-none me-2 mb-1 user-select-none" :type="account.organization ? 'success' : ''">{{account.display_name}}</el-tag></span>-->
            <router-link :to="`/i/trends/${account.name}`" v-for="account in nameList" :key="account"><el-tag class="text-decoration-none me-2 mb-1 user-select-none" :type="account.organization ? 'success' : ''">{{account.display_name}}</el-tag></router-link>
        </div>
      </div>
    </div>
    <transition name="el-fade-in">
        <div v-if="route.name === 'trends-name'" class="el-backtop" style="right: 40px; bottom: 90px"
             @click="()=>{ScrollTo(0);$router.push('/i/trends/')}">
            <arrow-left height="1em" status="" width="1em"/>
        </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import CandlestickChart from "../../components/modules/candlestickChart.vue";
import {useHead} from "@vueuse/head";
import {computed, reactive, ref, Ref, watch} from "vue";
import {ApiStaffData} from "../../types/Api";
import {useI18n} from "vue-i18n";
import {useStore} from "../../store";
import {Controller, request} from "../../share/Fetch";
import {Notice, ScrollTo} from "../../share/Tools";
import {onBeforeRouteUpdate, useRoute} from "vue-router";
import ArrowLeft from "../../icons/ArrowLeft.vue";

useHead({
  title: "K线图",
  meta: [{
    name: "theme-color",
    content: "#1da1f2"
  }]
})
const state = reactive<{
  activeAccount: Ref<string>
  activeData: Ref<ApiStaffData["data"]>
  lock: Ref<boolean>
}>({
  activeAccount: ref(''),
  activeData: ref({
    display_name: '',
    display_name_list: [],
    name: '',
    project: '',
    uid: '',
    followers: {},
    tweets_daily: {}
  }),
  lock: ref(true)
})

const {t} = useI18n()
const store = useStore()
const settings = computed(() => store.state.settings)
const names = computed(() => store.state.names)
const nameList = computed(() => [...new Set(Object.values(names.value).map(project => Object.values(project)).flat(2))])

const candleData = computed(() => {
  let tmpCandleData: {
    date: string[];
    series: number[][]
  } = {
    date: [],
    series: [],
  }
  if (state.activeData.name) {
    //date
    tmpCandleData.date = Object.keys(state.activeData.followers)
    //followers
    tmpCandleData.series = tmpCandleData.date.map(x => ([
      state.activeData.followers[x].start,
      state.activeData.followers[x].end,
      state.activeData.followers[x].highest,
      state.activeData.followers[x].lowest,
    ]))
    tmpCandleData.date = tmpCandleData.date.map(x => {
      let tmpX = [...(x + '')]
      return tmpX.splice(0, 4).join('') +'-'+ tmpX.splice(0, 2).join('') +'-'+ tmpX.join('')
    })
  }
  return tmpCandleData
})

watch(names, () => {
  if (Object.keys(names.value).length === 0) {
    state.lock = true
  }
})

watch(() => state.activeAccount, () => {
  fetchData()
})

const controller = new Controller()
const fetchData =  () => {
  request<ApiStaffData>(settings.value.basePath + '/static/trends2/' + state.activeAccount + '.json', controller).then(response => {
    state.activeData =  response.data
    state.lock = false
  }).catch(e => {
    if (controller.afterAbortSignal.aborted) {
      Notice(t("public.loading"), "warning")
    } else {
      Notice(String(e), 'error')
    }
  })
}

const route = useRoute()
if (route.params.name) {
  state.activeAccount = route.params.name.toString()
}
onBeforeRouteUpdate((to, from) => {
  state.activeAccount = to.params.name.toString()
})
</script>

<style scoped>

</style>