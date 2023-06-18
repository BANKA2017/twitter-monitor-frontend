<template>
  <div :style="{'position': 'sticky', 'top': '1.5rem'}">
    <el-skeleton :loading="state.loading" animated>
      <div class="card mb-4">
        <el-collapse-transition v-if="userInfo.banner !== 0">
          <div class="transition-height" v-show="isMobileRatio" :style="{'position': 'relative', 'aspect-ratio': !settings.displayPicture ? '3 / 1' : ''}">
            <el-image v-if="!settings.displayPicture" :src="createRealMediaPath(realMediaPath, samePath, 'userinfo')+`pbs.twimg.com/profile_banners/`+userInfo.uid_str+`/`+userInfo.banner+`/banner.jpg`" :preview-src-list="[createRealMediaPath(realMediaPath, samePath, 'userinfo')+`pbs.twimg.com/profile_banners/` + userInfo.uid_str+`/`+userInfo.banner+`/banner.jpg`]" alt="Banner" style="position: absolute; max-height: 100%;  " class="card-img-top banner" fit="cover" lazy preview-teleported hide-on-click-modal/>
          </div>
        </el-collapse-transition>
        <div style="display: flex; align-content: center; margin: 0 0.5em;">
          <div class="" style="width: calc(100% / 3); max-width: 110px; aspect-ratio: 1; display: inline-block; padding: 0.5em;" v-if="!settings.displayPicture">
            <el-image :class="verifiedStatus.verified_type === 'business' ? 'rounded-3' : 'rounded-circle'" :src="createRealMediaPath(realMediaPath, samePath, 'userinfo')+userInfo.header.replace(/([\w]+)\.([\w]+)$/gm, `$1_reasonably_small.$2`)" :preview-src-list="[createRealMediaPath(realMediaPath, samePath, 'userinfo')+userInfo.header]" alt="Avatar" preview-teleported hide-on-click-modal/>
          </div>
          <!--<div :class="{ 'col-8': ((width > 768 && height > 50) || userInfo.banner === 0), 'col-12': !((width > 768 && height > 50) || userInfo.banner === 0), 'my-4': (width > 768 && (height > 50 || userInfo.banner === 0)), 'mt-5': ((height <= 50 || width <= 768) && userInfo.banner !== 0), }" style=" justify-content: center;">-->
          <div class="" style="padding: 0.5em 1em; display: inline-block; align-self: center">
            <h5 class="card-title mb-1 fw-bold" style="display: flex; justify-content: space-between"><full-text :entities="[]" :full_text_origin="userInfo.display_name" :inline="true"/><verified v-if="verifiedStatus.verified" height="24px" :status="verifiedStatus.verified_type ? {business: 'text-gold', government: 'text-secondary'}[verifiedStatus.verified_type] : 'text-primary'" width="24px" class="mx-1 d-inline"/><blue-verified-icon v-if="!verifiedStatus.verified && verifiedStatus.blue_verified" :status="verifiedStatus.verified_type ? {business: 'text-gold', government: 'text-secondary'}[verifiedStatus.verified_type] : 'text-primary'" height="24px" width="24px" class="mx-1 d-inline"/></h5>
            <small style="display: block"><a :href="`//twitter.com/`+userInfo.name" class="text-dark" target="_blank">@{{ userInfo.name }}</a></small>
          </div>
        </div>
        <el-collapse-transition>
        <div v-show="!isHideDescription && userInfo.description_origin" style="padding: 0.5em 1em;">
          <full-text :entities="userInfo.description_entities" :full_text_origin="userInfo.description_origin" class="card-text transition-box"></full-text>
          <translate :id="userInfo.uid_str" :to="settings.language" type="1" :text="userInfo.description" class="transition-box"/>
        </div>
      </el-collapse-transition>
      </div>
    </el-skeleton>
    <el-skeleton :loading="!state.chartData.length" :rows="4" anmiated v-if="state.chartData && state.chartExisted">
      <tmv2-chart chart-height="250px" :chart-rows="state.chartData" :grid="{left: '18%', right: '18%'}" :label-map="state.labelMap" :legend-not-selected="[1]" :y-axis="[{type: 'value', scale: true, minInterval: 1}, {type: 'value', scale: true, minInterval: 1}]" :y-axis-index="[0, 0, 1]" chart-type="line"></tmv2-chart>
    </el-skeleton>
    <div v-else class="w-100">
      <div class="d-inline me-4" v-for="type in ['followers', 'following']" :key="type">
        <span class="fw-bolder fs-6 me-1">{{ userInfo[type] }}</span>
        <span>{{ t('public.' + type) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, Ref, ref, watch} from "vue";
import {useStore} from "../store";
import Verified from "../icons/Verified.vue";
import FullText from './FullText.vue'
import Translate from "./Translate.vue";
import {Controller, request} from "../share/Fetch";
import {ApiChartLegacy, ApiUserInfo} from "../types/Api";
import {Notice, createRealMediaPath, VerifiedStatus} from "../share/Tools";
import {LegacyChart} from "../types/Content";
import {useI18n} from "vue-i18n";
import {onBeforeRouteLeave, onBeforeRouteUpdate, RouteLocationNormalized, useRoute, useRouter} from "vue-router";
import {useHead} from "@vueuse/head";
import BlueVerifiedIcon from "../icons/BlueVerifiedIcon.vue";
let Tmv2Chart
if (import.meta.env.VITE_DEV_BASE_PATH??import.meta.env.VITE_PRO_BASE_PATH??'') {
    Tmv2Chart = defineAsyncComponent(() => import("./Charts/Tmv2ChartWithoutDataSet.vue"));
}

const { t } = useI18n()

const store = useStore()
const router = useRouter()
const route = useRoute()
const width = computed(() => store.state.width)
const height = computed(() => store.state.height)
const settings = computed(() => store.state.settings)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)
const updatedCharts = computed(() => store.state.updatedCharts)
const altitudeDifference = computed(() => store.state.altitudeDifference)
const userInfo = computed(() => store.state.userInfo)

const isMobileRatio = computed(() => width.value <= 992 || height.value <= 50 || altitudeDifference.value > 0)
const isHideDescription = computed(() => width.value > 992 && height.value > 50)

const state = reactive<{
  loading: boolean;
  chartExisted: boolean;
  chartData: Ref<LegacyChart[]>;
  latestChartTimestamp: Ref<number>;
  labelMap: {[p in 'timestamp' | 'followers' | 'following' | 'statuses_count']: string}
  title: Ref<string>
}>({
  loading: true,
  chartExisted: true,
  title: ref('Twitter Monitor'),
  chartData: ref([]),
  latestChartTimestamp: ref(0),
  labelMap: {
    timestamp: t("timeline.scripts.time"),
    followers: t("public.followers"),
    following: t("public.following"),
    statuses_count: t("public.statuses_count"),
  }
})

useHead({
  title: computed(() => state.title)
})

const controllerList = {
  userInfo: new Controller(),
  chart: new Controller()
}

const getUserInfo = (to: RouteLocationNormalized) => {
  const name = to.params.name ? to.params.name.toString() : ''
  state.loading = true
  state.chartData = []
  if (to.name === 'no-name-status') {return}
  if (typeof name === "object") {Notice("Wrong name"); return}
  request<ApiUserInfo>(settings.value.basePath + '/api/v3/data/userinfo/?name=' + name, controllerList.userInfo).then(response => {
    store.dispatch('setCoreValue', {key: 'userInfo', value: response.data})
    if (response.code === 200) {
      //this.chart.legendName = {
      //  '关注者': '关注者 ' + this.info.followers,
      //  '正在关注': '正在关注 ' + this.info.following,
      //  '总推文数': '总推文数 ' + this.info.statuses_count
      //};
      store.dispatch("setCoreValue", {key: 'userExists', value: true})
      store.dispatch("setCoreValue", {key: 'topTweetId', value: response.data.top})
      state.title = (to.name === 'name-display' || to.name === 'name-status') ? userInfo.value.display_name + ' (@' + userInfo.value.name + ') / Twitter Monitor' : "Twitter Monitor"
      createChart()
    } else {
      Notice(response.message, "error")
      //this.chart.legendName = {'关注者': '关注者', '正在关注': '正在关注', '总推文数': '总推文数'};
      store.dispatch("setCoreValue", {key: 'userExists', value: false})
    }
    state.loading = false
  }).catch(e => {
    if (controllerList.userInfo.afterAbortSignal.aborted) {
      Notice(t("public.loading"), "warning")
    } else {
      Notice(String(e), "error")
    }
  })
}

const createChart = (time: number = 0, refresh: boolean = false) => {
  request<ApiChartLegacy>(settings.value.basePath + '/api/v3/data/chart/?uid=' + userInfo.value.uid_str + (time > 0 ? '&end=' + time : '') + (refresh ? '&refresh=1' : ''), controllerList.chart).then(response => {
    if (response.data.length) {
      state.latestChartTimestamp = Number(response.data.slice(-1)[0].timestamp)
    }
    let tmpRows = response.data.map(x => {
      x.timestamp = (new Date(Number(x.timestamp) * 1000)).toLocaleString(settings.value.language)
      return x
    })
    state.chartData = refresh ? [...state.chartData, ...tmpRows] : tmpRows
    if (!state.chartData.length && !refresh) {
      state.chartExisted = false
    }
  }).catch(e => {
    if (controllerList.chart.afterAbortSignal.aborted) {
      Notice(t("public.loading"), "warning")
    } else {
      Notice(t("timeline.scripts.message.failed_to_generate_chart", [String(e)]), "error")
      setTimeout(() => {
        createChart(time, refresh)
      }, 5000)
    }
  })
}

const verifiedStatus = computed(() => VerifiedStatus(userInfo.value.verified))

watch(updatedCharts, () => {
  if (!updatedCharts.value) {
    store.dispatch('setCoreValue', {key: 'updatedCharts', value: true})
    createChart(state.latestChartTimestamp, true)
  }
})

onMounted(() => {
  getUserInfo(route)
})
onBeforeRouteUpdate((to, from) => {
  if ((to.name === 'name-status' && from.name === 'no-name-status' && to.params.name !== userInfo.value.name) || (to.params.name !== from.params.name && (to.name === 'name-display' || to.name === 'name-status') && to.params.name !== userInfo.value.name)) {
    getUserInfo(to)
  }
})
onBeforeRouteLeave((to, from) => {
  if ((to.name === 'name-status' && from.name === 'no-name-status' && to.params.name !== userInfo.value.name) || (to.params.name !== from.params.name && (to.name === 'name-display' || to.name === 'name-status') && to.params.name !== userInfo.value.name)) {
    getUserInfo(to)
  }
})
</script>

<style lang="scss">

</style>
