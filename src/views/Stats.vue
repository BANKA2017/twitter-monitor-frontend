<template>
  <div id="stats">
    <single-page-header title="统计" sub-title="咕咕咕" />

    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <tmv2-chart :chart-rows="chartData('followers')" :colors="['#19d4ae']" :label-map="{name: 'name', followers: '关注者'}" sort-key="followers"/>
          <div class="my-4"></div>
          <tmv2-chart :chart-rows="chartData('following')" :colors="['#5ab1ef']" :label-map="{name: 'name', following: '正在关注'}" sort-key="following"/>
          <div class="my-4"></div>
          <tmv2-chart :chart-rows="chartData('statuses_count')" :colors="['#fa6e86']" :label-map="{name: 'name', statuses_count: '总推文数'}" sort-key="statuses_count"/>
        </div>
        <div class="col-md-6">
          <tmv2-table :table-data="tableData"/>
        </div>
      </div>
    </div>
    <div class="my-4"></div>
    <div class="text-center">
      <el-button circle @click="$router.go(-1)"><arrow-left height="1em" status="" width="1em"/></el-button>
    </div>
    <div class="my-4"></div>
    <div class="text-center" style="height: 30px">
      NEST.MOE
    </div>
  </div>
</template>

<script lang="ts">
import Tmv2Table from "@/components/Tmv2Table.vue"
import Tmv2Chart from "@/components/Tmv2ChartWithoutDataSet.vue"
import {computed, defineComponent, onMounted, reactive, Ref, ref} from "vue"
import {useHead} from "@vueuse/head"
import ArrowLeft from "@/icons/ArrowLeft.vue"
import SinglePageHeader from "../components/SinglePageHeader.vue"
import {useStore} from "@/store"
import {request} from "@/share/Fetch"
import {Stats} from "@/type/Content"
import {ApiStats} from "@/type/Api"
import {Notice} from "@/share/Tools"
export default defineComponent({
  components: {SinglePageHeader, ArrowLeft, Tmv2Chart, Tmv2Table},
  setup() {
    useHead({
      title: '统计',
      meta: [{name: "theme-color", content: "#1da1f2"}]
    })

    const state = reactive<{
      rawData: Ref<Stats[]>
    }>({
      rawData: ref([])
    })

    const store = useStore()
    const settings = computed(() => store.state.settings)
    const tableData = computed(() => {
      if (!state.rawData) {
        return []
      }
      return state.rawData.map(x => ({
        name: x.display_name,
        following: x.following,
        followers: x.followers,
        statuses_count: x.statuses_count,
        group: x.group
      }))
    })

    const chartData = (type: string) => {
      if (!state.rawData) {
        return []
      }
      return state.rawData.map((x: any) => ({
        name: x.display_name,
        [type]: x[type],
      }))
    }

    onMounted(async () => {
      await request<ApiStats>(settings.value.basePath + '/api/v2/data/stats/').then(response => {
        state.rawData = response.data
        if (!state.rawData.length) {
          Notice("chart: " + response.message, "warning");
        }
      }).catch((e: Error) => Notice(String(e), "error"))
    })

    return {chartData, tableData}
  },
})
</script>

<style scoped>

</style>
