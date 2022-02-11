<template>
  <div :style="{'position': 'sticky', 'top': '1.5rem'}">
    <el-skeleton :loading="state.loading" animated>
      <!--TODO fix !displayPicture-->
      <!--TODO replace .banner to cacheable extension for banner-->
      <div class="card mb-4">
        <el-collapse-transition>
          <div class="row no-gutters" v-show="isMobileRatio" :style="{'position': 'relative', 'aspect-ratio': !settings.displayPicture ? '3 / 1' : ''}">
            <el-image v-if="!settings.displayPicture" :src="createRealMediaPath(realMediaPath, samePath, 'userinfo')+`pbs.twimg.com/profile_banners/`+state.userInfo.uid_str+`/`+state.userInfo.banner+`.banner`" :preview-src-list="[createRealMediaPath(realMediaPath, samePath, 'userinfo')+`pbs.twimg.com/profile_banners/`+state.userInfo.uid_str+`/`+state.userInfo.banner+`.banner`]" alt="Banner" style="position: absolute" class="col-12 card-img-top banner" fit="cover" lazy append-to-body hide-on-click-modal/>
          </div>
        </el-collapse-transition>
        <!--TODO fix no banner-->
        <div class="row mx-2">
          <div :class="{'col-4': width > 768 && height > 50,}" v-if="!settings.displayPicture" style="width: calc(100% / 4); max-width: 100px; aspect-ratio: 1; align-items: center; display: flex; justify-content: center; margin: -50% 0">


            <el-image class="rounded-circle" :src="createRealMediaPath(realMediaPath, samePath, 'userinfo')+state.userInfo.header" :preview-src-list="[createRealMediaPath(realMediaPath, samePath, 'userinfo')+state.userInfo.header]" alt="Avatar" append-to-body hide-on-click-modal :z-index="9901"/>
          </div>
          <div :class="{ 'margin-3': isMobileRatio, 'col-8': width > 768 && height > 50, 'col-12': settings.displayPicture, 'my-2': height > 50, 'mt-5': (height <= 50 || width <= 768) }" style=" justify-content: center;">


            <h5 class="card-title mb-1 align-middle"><b>{{ state.userInfo.display_name }}</b><verified height="1em" status="text-primary" width="1.2em" class="ml-2 "/></h5>
            <small><a :href="`//twitter.com/`+state.userInfo.name" class="text-dark" target="_blank">@{{ state.userInfo.name }}</a></small>
          </div>
          <el-collapse-transition>
            <div v-show="!isHideDescription" class="margin-3">
              <full-text :entities="state.userInfo.description_entities" :full_text_origin="state.userInfo.description_origin" class="transition-box"></full-text>
              <translate :id="state.userInfo.uid_str" :to="settings.language" type="1" class="transition-box"/>
            </div>
          </el-collapse-transition>
        </div>
      </div>
    </el-skeleton>
    <el-skeleton :loading="!state.chartData.length" :rows="4" anmiated v-if="state.chartData && state.chartExisted">
      <tmv2-chart chart-height="250px" :chart-rows="state.chartData" :grid="{left: '18%', right: '18%'}" :label-map="state.labelMap" :legend-not-selected="[1]" :y-axis="[{type: 'value', scale: true, minInterval: 1}, {type: 'value', scale: true, minInterval: 1}]" :y-axis-index="[0, 0, 1]" chart-type="line"></tmv2-chart>
    </el-skeleton>
    <el-table v-else :data="[{followers: state.userInfo.followers, following: state.userInfo.following, statuses_count: state.userInfo.statuses_count}]" style="width: 100%">
      <el-table-column :label="t('public.followers')" prop="followers"></el-table-column>
      <el-table-column :label="t('public.following')" prop="following"></el-table-column>
      <el-table-column :label="t('public.statuses_count')" prop="statuses_count"></el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, Ref, ref, watch} from "vue";
import {useStore} from "@/store";
import Verified from "@/icons/Verified.vue";
import Deleted from "@/icons/Deleted.vue";
import Locked from "@/icons/Locked.vue";
import FullText from '@/components/FullText.vue'
import Translate from "@/components/Translate.vue";
import {request} from "@/share/Fetch";
import {ApiChartLegacy, ApiUserInfo} from "@/type/Api";
import {Notice, createRealMediaPath} from "@/share/Tools";
import {Chart, UserInfo} from "@/type/Content";
import {useI18n} from "vue-i18n";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import Tmv2Chart from "@/components/modules/tmv2Chart.vue";

const { t } = useI18n()

const store = useStore()
const router = useRouter()
const route = useRoute()
const width = computed(() => store.state.width)
const height = computed(() => store.state.height)
const settings = computed(() => store.state.settings)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)

const isMobileRatio = computed(() => width.value <= 768 || height.value <= 50)
const isHideDescription = computed(() => width.value > 768 && height.value > 50)

const state = reactive<{
  loading: boolean;
  chartExisted: boolean;
  userInfo: Ref<UserInfo>;
  chartData: Ref<Chart[]>;
  latestChartTimestamp: Ref<Number>;
  labelMap: {[p in 'timestamp' | 'followers' | 'following' | 'statuses_count']: string}
}>({
  loading: true,
  chartExisted: true,
  userInfo: ref({
    uid: 0,
    uid_str: "",
    name: "",
    display_name: "",
    header: "",
    banner: 0,
    following: 0,
    followers: 0,
    description: "",
    description_origin: "",
    statuses_count: 0,
    top: "",
    locked: 0,
    deleted: 0,
    verified: 0,
    description_entities: []
  }),
  chartData: ref([]),
  latestChartTimestamp: ref(0),
  labelMap: {
    timestamp: t("timeline.scripts.time"),
    followers: t("public.followers"),
    following: t("public.following"),
    statuses_count: t("public.statuses_count"),
  }
})

const getUserInfo = (name: string | string[]) => {
  state.loading = true
  if (route.name === 'no-name-status') {return}
  if (typeof name === "object") {Notice("Wrong name"); return}
  request<ApiUserInfo>(settings.value.basePath + '/api/v2/data/userinfo/?name=' + name, controller).then(response => {
    state.userInfo = response.data
    if (response.code === 200) {
      //this.chart.legendName = {
      //  '关注者': '关注者 ' + this.info.followers,
      //  '正在关注': '正在关注 ' + this.info.following,
      //  '总推文数': '总推文数 ' + this.info.statuses_count
      //};
      store.dispatch("setCoreValue", {key: 'userExists', value: true})
      createChart()
    } else {
      Notice(response.message, "error")
      //this.chart.legendName = {'关注者': '关注者', '正在关注': '正在关注', '总推文数': '总推文数'};
      store.dispatch("setCoreValue", {key: 'userExists', value: false})
    }
    state.loading = false
  }).catch(e => Notice(String(e), "error"))
}

const createChart = (time: number = 0, refresh: boolean = false) => {
  request<ApiChartLegacy>(settings.value.basePath + '/api/v2/data/chart/?uid=' + state.userInfo.uid_str + (time > 0 ? '&end=' + time : '') + (refresh ? '&refresh=1' : ''), controller).then(response => {
    if (response.data.length) {
      state.latestChartTimestamp = Number(response.data.slice(-1)[0].timestamp)
    }
    let  tmpRows = response.data.map(x => {
      x.timestamp = (new Date(Number(x.timestamp) * 1000)).toLocaleString(settings.value.language)
      return x
    })
    state.chartData = refresh ? [...state.chartData, ...tmpRows] : tmpRows
    if (!state.chartData.length && !refresh) {
      state.chartExisted = false
    }
  }).catch(e => {
    Notice(t("timeline.scripts.message.failed_to_generate_chart", [String(e)]), "error")
    setTimeout(() => {
      createChart(time, refresh)
    }, 5000);
  })
}

const controller = new AbortController

onMounted(() => {
  getUserInfo(route.params.name)
})
router.afterEach((to, from) => {
  if (to.params.name !== from.params.name && (to.name === 'name-display' || to.name === 'name-status')) {
    getUserInfo(to.params.name)
  }
  //TODO update title
  //store.dispatch({
  //  type: 'setCoreValue',
  //  key: 'title',
  //  value: !(to.name === 'name-display' || to.name === 'name-status') ? state.userInfo.display_name + ' (@' + state.userInfo.name + ') / Twitter Monitor' : "Twitter Monitor"
  //})
})
</script>

<style scoped>
.banner {
  width: 100%;
  position: absolute;
  top: 0;
  object-fit: cover;
}
.header {
  top: 0;
  width: calc(100% / 4);
}
.header-father {
  position: absolute;
  transform: translateY(-50%) translateX(3%);
}
.margin-3 {
  margin: 3%;
}
</style>
