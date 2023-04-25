<template>
  <div id="staff-candle-stick-page">
    <single-page-header title="部分官推数据" sub-title="以后可能会合并到 Trends，届时适用于全部账号" />
    <div class="container">
      <div class="row">
        <div class="col-md-3 order-md-0 order-1">
          <template v-for="(userList, groupName) in staffList" :key="groupName">
            <p class="lead">{{ groupName }}</p>
            <div class="list-group mb-3">
              <div role="button" :class="{'list-group-item': true, 'active': user === state.activeStaff}" v-for="user in userList" :key="user" @click="state.activeStaff = user">
                {{ user }}
              </div>
            </div>
          </template>
          <div class="text-center my-4"> >_ Twitter Monitor</div>
        </div>
        <div class="col-md-9 order-md-1 order-0">
          <p class="text-center lead" v-if="state.lock">请选择一个账号</p>
          <div v-else>
            <candlestick-chart height="500px" :set-option="{notMerge: false}" :data-array="candleData.series" :x-axis-data="candleData.date" title="关注数K线图" :zoom="true" :ma_line="true"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CandlestickChart from "../../components/modules/candlestickChart.vue";
import {computed, onMounted, reactive, ref, Ref, toRefs, watch} from "vue";
import {useHead} from "@vueuse/head";
import {useStore} from "../../store";
import {Controller, request} from "../../share/Fetch";
import {Notice} from "../../share/Tools";
import {useI18n} from "vue-i18n";
import {ApiStaffData} from "../../types/Api";
import SinglePageHeader from "../../components/SinglePageHeader.vue";

useHead({
  title: "烛图数据",
  meta: [{
    name: "theme-color",
    content: "#1da1f2"
  }]
})

const staffLists = {
  "BanG Dream!": [
    "bang_dream_info",
    "bang_dream_gbp",
    "bangdreamgbp_EN",
    "bangdreamparty_",
  ],
  "MyGO!!!!!": ["bang_dream_mygo"],
  "ARGONAVIS": ["ARGONAVIS_info"],
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
}
const state = reactive<{
  activeStaff: Ref<string>
  activeData: Ref<ApiStaffData["data"]>
  lock: Ref<boolean>
}>({
  activeStaff: ref(''),
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
const staffList = computed(() => {
  let tmpList: {[p: string]: string[]} = {}
  Object.keys(names.value).forEach(name => {
    tmpList[name] = Object.values(names.value[name]).flat().filter(account => account.name !== '').map(account => account.name)
  })
  return tmpList
})

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

watch(() => state.activeStaff, () => {
  fetchData()
})

const controller = new Controller()
const fetchData =  () => {
  request<ApiStaffData>(settings.value.basePath + '/static/trends2/' + state.activeStaff + '.json', controller).then(response => {
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

</script>

<style scoped>

</style>
