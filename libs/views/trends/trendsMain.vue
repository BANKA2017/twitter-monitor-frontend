<template>
  <div id="trends-main">
    <div class="container">
      <div class="row">
        <div class="col-md-6 mb-2">
          <el-skeleton :loading="state.hashTagsRank24.length === 0" :rows="7" animated>
            <word-cloud-chart-for-annual2021 :data="state.hashTagsRank24.map(data => ({name: data.text, value: data.count}))" :size-range="[10, 70]" height="300px" class="mb-2" />
            <ul class="list-group">
              <router-link v-for="(hashtagInfo, order) in state.hashTagsRank24" :key="order" :to="`/hashtag/` + hashtagInfo.text" class="col-md-12 text-muted text-decoration-none list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                #{{ hashtagInfo.text }}
                <span class="badge bg-primary rounded-pill">{{ hashtagInfo.count }}</span>
              </router-link>
            </ul>
          </el-skeleton>
        </div>
        <div class="col-md-6 mb-2">
          <div class="row">
            <div v-for="(v, k) in state.userData" :key="k" :class="{'mb-2': true, 'col-md-12': true}">
              <label :for="`list`+k" class="text-muted small mb-2">{{ state.listType[k][0] }}</label>
              <div :id="`list`+k" class="list-group">
                <template v-for="(data, key) in v">
                  <router-link v-if="!(k === 2 && data.count < 0)" :key="key" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" :to="`/` + data.name + `/all`">
                    <div class="d-flex w-100 justify-content-between">
                      <div >
                        <el-image :src="settings.mediaPath + (data.header.replace(/https:\/\/|http:\/\//, ''))" class="rounded-circle d-inline-block mx-2" style="max-height: 50px; max-width: 50px"></el-image>
                        <div class="d-inline-block">
                          <h5 class="mb-1 d-inline-block text-truncate">{{ data.display_name }}</h5>
                          <p class="mb-1">@{{ data.name }}</p>
                        </div>
                      </div>
                      <small><span class="badge bg-primary rounded-pill">{{ data.count }}</span></small>
                    </div>
                  </router-link>
                </template>
              </div>
            </div>
            <div class="col-md-12 mb-2">
              <h5 class="text-muted small">发推时间段 (GMT+9)</h5>
              <tmv2-chart :chart-rows="timeCount" :label-map="{time: '发推时间', count: '数量'}" :y-axis="{type: 'value', name: '推文数量'}" chartHeight="220px"/>
            </div>
            <div class="col-md-12">
              <h5 class="text-muted small">账号列表 ({{nameList.length}})</h5>
              <!--<span v-for="account in nameList" :key="account"><el-tag class="text-decoration-none me-2 mb-1 user-select-none" :type="account.organization ? 'success' : ''">{{account.display_name}}</el-tag></span>-->
              <router-link :to="`/i/trends/${account.name}`" v-for="account in nameList" :key="account"><el-tag class="text-decoration-none me-2 mb-1 user-select-none" :type="account.organization ? 'success' : ''">{{account.display_name}}</el-tag></router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="el-fade-in">
      <div class="el-backtop" style="right: 40px; bottom: 90px; "
           @click="()=>{getData()}">
        <arrow-clockwise height="1em" status="" width="1em" :class="{'animate-spin': state.updating}" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import Tmv2Chart from "../../components/Charts/Tmv2ChartWithoutDataSet.vue"
import {computed, onMounted, reactive, ref, Ref} from "vue"
import ArrowClockwise from "../../icons/ArrowClockwise.vue"
import {useStore} from "../../store"
import {request} from "../../share/Fetch"
import {ApiTrends} from "../../types/Api"
import {Notice} from "../../share/Tools"
import WordCloudChartForAnnual2021 from "../../components/Charts/WordCloudChart.vue";

const state = reactive<{
  hashTagsRank24: Ref<{text: string; count: number}[]>
  timeCountOriginal: Ref<number[]>
  userData: Ref<{name: string; display_name: string; header: string; count: number}[][]>
  listType: string[][]
  updating: boolean
}>({
  hashTagsRank24: ref([]),
  timeCountOriginal: ref([]),
  userData: ref([]),
  listType: [['增粉榜', '#fa6e86'], ['掉粉榜', '#19d4ae'], ['发推榜', '#fa6e86']],
  updating: false,
})

const store = useStore()
const settings = computed(() => store.state.settings)
//const samePath = computed(() => store.state.samePath)
const timeCount = computed(() => state.timeCountOriginal.map((count, time) => ({time: time, count: count})))
const names = computed(() => store.state.names)
const nameList = computed(() => [...new Set(Object.values(names.value).map(project => Object.values(project)).flat(2))])
//const createRealMediaPath = (type: string = 'tweets') => {
//  return realMediaPath + (samePath ? type + '/' : '')
//}

const getData = () => {
  state.updating = true
  request<ApiTrends>(settings.value.basePath + '/api/v3/data/trends').then(response => {
    state.hashTagsRank24 = response.data.hashtag_list
    state.timeCountOriginal = response.data.tweet_time_list
    response.data.following.push(response.data.statuses)
    state.userData = response.data.following
    state.userData[1] = state.userData[1].reverse()
    state.updating = false
  }).catch((e: Error) => {
    state.updating = false
    Notice(String(e), "error")
  })
}
onMounted(() => {
  getData()
})
</script>

<style scoped>

</style>