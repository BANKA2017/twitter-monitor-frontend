<template>
  <div id="trends">
    <single-page-header title="趋势" />
    <div class="container">
      <div class="row">
        <div class="col-md-6 mb-2">
          <el-skeleton :loading="hashTagsRank24.length === 0" :rows="7" animated>
            <ul class="list-group">
              <router-link v-for="(hashtagInfo, order) in hashTagsRank24" :key="order" :to="`/hashtag/` + hashtagInfo.text" class="col-md-12 text-muted text-decoration-none list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                #{{ hashtagInfo.text }}
                <span class="badge badge-primary badge-pill">{{ hashtagInfo.count }}</span>
              </router-link>
            </ul>
          </el-skeleton>
        </div>
        <div class="col-md-6 mb-2">
          <div class="row">
            <div v-for="(v, k) in userData" :key="k" :class="{'mb-2': true, 'col-md-12': true}">
              <label :for="`list`+k" class="text-muted small mb-2">{{ listType[k][0] }}</label>
              <div :id="`list`+k" class="list-group">
                <template v-for="(data, key) in v">
                  <router-link v-if="!(k === 2 && data.count < 0)" :key="key" :class="{'list-group-item': true, 'list-group-item-action': true, 'd-flex': false, 'justify-content-between': true, 'align-items-center': true}" :to="`/` + data.name + `/all`">
                    <el-image :src="settings.mediaPath + (data.header.replace(/https:\/\/|http:\/\//, ''))" class="rounded-circle img-fluid" lazy style="max-height: 50px; max-width: 50px"></el-image>
                    <div class="d-flex w-100 justify-content-between">
                      <h5 class="mb-1 d-inline-block text-truncate">{{ data.display_name }}</h5>
                      <small><span class="badge badge-primary badge-pill">{{ data.count }}</span></small>
                    </div>
                    <p class="mb-1">@{{ data.name }}</p>
                  </router-link>
                </template>
              </div>
            </div>
            <div class="col-md-12">
              <tmv2-chart :chart-rows="timeCount" :label-map="{time: '发推时间', count: '数量'}" :y-axis="{type: 'value', name: '推文数量'}" chartHeight="220px" title="发推时间段 (GMT+9)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="el-fade-in">
      <div class="el-backtop" style="right: 40px; bottom: 90px"
           @click="()=>{getData()}">
        <arrow-clockwise height="1em" status="" width="1em" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Tmv2Chart from "@/components/Tmv2ChartWithoutDataSet.vue"
import {computed, defineComponent, onMounted, reactive, ref, toRefs, Ref} from "vue"
import {useHead} from "@vueuse/head"
import ArrowClockwise from "@/icons/ArrowClockwise.vue"
import SinglePageHeader from "../components/SinglePageHeader.vue"
import {useStore} from "@/store"
import {request} from "@/share/Fetch"
import {ApiTrends} from "@/type/Api"
import {Notice} from "@/share/Tools"
export default defineComponent({
  components: {SinglePageHeader, ArrowClockwise, Tmv2Chart},
  setup () {
    useHead({
      title: '趋势',
      meta: [{name: "theme-color", content: "#1da1f2"}]
    })

    const state = reactive<{
      hashTagsRank24: Ref<{text: string; count: number}[]>
      timeCountOrigin: Ref<number[]>
      userData: Ref<{name: string; display_name: string; header: string; count: number}[][]>
      listType: string[][]
    }>({
      hashTagsRank24: ref([]),
      timeCountOrigin: ref([]),
      userData: ref([]),
      listType: [['增粉榜', '#fa6e86'], ['掉粉榜', '#19d4ae'], ['发推榜', '#fa6e86']],
    })

    const store = useStore()
    const settings = computed(() => store.state.settings)
    //const samePath = computed(() => store.state.samePath)
    const timeCount = computed(() => state.timeCountOrigin.map((count, time) => ({time: time, count: count})))

    //const createRealMediaPath = (type: string = 'tweets') => {
    //  return realMediaPath + (samePath ? type + '/' : '')
    //}

    const getData = () => {
      request<ApiTrends>(settings.value.basePath + '/api/v2/data/trends').then(response => {
        state.hashTagsRank24 = response.data.hashtag_list
        state.timeCountOrigin = response.data.tweet_time_list
        response.data.following.push(response.data.statuses)
        state.userData = response.data.following
        state.userData[1] = state.userData[1].reverse()
      }).catch((e: Error) => Notice(String(e), "error"))
    }
    onMounted(() => {
      getData()
    })
    return {...toRefs(state), timeCount, settings, getData}

  }
})
</script>

<style scoped>

</style>
