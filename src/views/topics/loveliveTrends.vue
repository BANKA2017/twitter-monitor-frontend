<template>
  <div id="lovelive-trends">
    <single-page-header title="LoveLive! Trends" :sub-title="trendsData.range.start ? (createDate(trendsData.range.start) + '~' + createDate(trendsData.range.end)) : ''" />
    <div class="container">
      <div class="row">
        <div class="col-lg-2 mb-4">
          <button role="button" :class="{'text-white': selectedTeams.has(name),  'btn-block': true, 'btn': true}" :style="{'background-color': selectedTeams.has(name) ? colorInfo : '#ffffff'}" v-for="(colorInfo, name) in color" :key="name" @click="selectedTeams.has(name) ? selectedTeams.delete(name) : selectedTeams.add(name)">
            {{ name }}
          </button>
          <button :class="{'btn': true, 'btn-block': true, 'btn-outline-primary': true, 'active': status.displayTips}" @click="status.displayTips = !status.displayTips">说明 <info-circle-fill height="1em" status="" width="1em" /></button>
          <a :href="settings.basePath + '/static/lovelive_trends/' + dateList[status.dateOrder] + '.json'" class="btn btn-block btn-outline-primary" target="_blank">下载数据 <download-icon height="1em" status="" width="1em" /></a>
        </div>
        <div class="col-lg-8 mb-4">
          <div class="card" v-show="status.displayTips">
            <div class="card-body">
              <h5 class="card-title">说明</h5>
              <h6 class="card-subtitle mb-2 text-muted">如何使用本页</h6>
              <ul class="card-body">
                <li>目前本页仍在测试，界面及数据结构不代表最终产品……至少它能用了</li>
                <li>左上角为本地时间，所以可能会出现日期对不上的问题</li>
                <li>点击 「下载数据」 按钮可以下载当前所展示的图表所用到的原始数据，原始数据的细节远比现在图表化的部分要多</li>
                <li>点击侧边或顶上组合名称可以进行数据筛选，目前仍然非常粗糙……至少能用</li>
                <li>本页非常粗糙的另一个原因是我没有头绪，不知道应该展示些什么，如果您有更多的想法，请告诉我；如果本站的任何账号有错误，请指正</li>
                <li>本页仅提供 LoveLive! 企划中的 Aqours、虹ヶ咲学園 以及 Liella! 相关人士的数据，不包含 μ's</li>
                <li>更新时间为东京时间的每周日零点零一分 (Sunday 0:01 GMT+9)，可能会有几分钟的延迟</li>
                <li>原始想法来自<a href="https://www.bilibili.com/read/readlist/rl360153" target="_blank">Oricanon-2021</a>，感谢专栏作者提供了灵感</li>
              </ul>
            </div>
          </div>
          <template v-if="trendsData === {}" >
            <p class="text-center">Please wait...</p>
          </template>
          <template v-if="selectedTeams.length === 0" >
            <p class="text-center">请选中一个组合</p>
          </template>
          <template v-else-if="status.userOrder !== -1" >
            <p class="display-4">{{ trendsData.data[status.userOrder].name_cn }}</p>
            <p>
              <router-link :to="`/`+ trendsData.data[status.userOrder].name +`/all`" class="text-decoration-none text-muted">@{{ trendsData.data[status.userOrder].name }}</router-link> <span :style="{'background-color': trendsData.data[status.userOrder].color}" class="badge badge-pill text-white">{{ trendsData.data[status.userOrder].color }}</span> <span :style="{'background-color': color[trendsData.data[status.userOrder].team]}" class="badge badge-pill text-white">{{ trendsData.data[status.userOrder].team }}</span>
            </p>
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-6 mb-4">
                  <candlestick-chart :set-option="{notMerge: true}" :data-array="trendsData.data[status.userOrder].followers.map(x => [x.start, x.end, x.lowest, x.highest])" :x-axis-data="['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']" title="关注数K线图"/>
                </div>
                <div class="col-md-6 mb-4">
                  <tmv2-chart :chart-rows="trendsData.data[status.userOrder].tweets.hour_count.map((count, time) => ({time: time, count: count}))" :label-map="{time: '发推时间', count: '数量'}" :y-axis="{type: 'value', name: '推文数量'}" chartHeight="260px" class="col-md-12" title="发推时间段"/>
                </div>
                <div class="col-md-6 mb-4">
                  <label class="text-muted" for="tag-list">Tag 统计</label>
                  <div id="tag-list" class="list-group">
                    <router-link v-for="(count, tagName) in trendsData.data[status.userOrder].tweets.tag" :key="tagName" :to="`/hashtag/` + tagName" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                      #{{ tagName }}
                      <span class="badge badge-primary badge-pill">{{ count }}</span>
                    </router-link>
                  </div>
                </div>
                <div class="col-md-6 mb-4">
                  <label class="text-muted" for="link-list">链接统计</label>
                  <div id="link-list" class="list-group">
                    <div v-for="(count, linkName) in trendsData.data[status.userOrder].tweets.link" :key="linkName" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                      {{ linkName }}
                      <span class="badge badge-danger badge-pill">{{ count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <template v-if="status.value === 'overview'" >
              <tmv2-chart :chart-rows="userData.count_data" :colors="userData.color" :label-map="userData.label" chart-type="line" chartHeight="500px" title="关注数" :set-option="{notMerge: true}"/>
              <tmv2-chart :chart-rows="userData.data" :colors="userData.color" :label-map="userData.label" chart-type="line" chartHeight="500px" title="关注数变动" :set-option="{notMerge: true}"/>
              <el-table ref="accountData" v-loading="!trendsData.data.length" :data="tableData" :default-sort="{prop: 'followers_add', order: 'descending'}" style="width: 100%">
                <el-table-column label="名称">
                  <template #default="scope">
                    <!--<el-button @click="() => {status.name = scope.row.name; status.value = 'info'}" type="text" size="small">详情</el-button>-->
                    <el-button size="small" type="text" @click="() => {ScrollTo();status.userOrder = scope.row.order}">{{ scope.row.display_name[0] }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="关注者数" prop="followers" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="关注变化量" prop="followers_add" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="关注增长率" prop="followers_growth_rate" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="发推数" prop="tweets_count" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="组" prop="team">
                  <template #default="scope">
                    <el-tag :color="color[scope.row.team]" class="text-white" disable-transitions>
                      {{ scope.row.team }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <div class="row no-gutters my-4">
              <tmv2-chart :chart-rows="timeCountRows" :label-map="{time: '发推时间', count: '数量'}" :y-axis="{type: 'value', name: '推文数量'}" chartHeight="260px" class="col-md-12" title="发推时间段"/>
            </div>
          </template>
        </div>
        <div class="col-lg-2">
          <div class="list-group">
            <button type="button" :class="{'list-group-item': true, 'list-group-item-action': true, active: order === status.dateOrder}" v-for="(date, order) in dateList" :key="date" @click="status.dateOrder = order">
              {{ date }}
            </button>
          </div>
          <div class="text-center my-4"> >_ Twitter Monitor</div>
        </div>
      </div>
    </div>
    <transition name="el-fade-in">
      <div v-if="status.userOrder !== -1" class="el-backtop" style="right: 40px; bottom: 90px"
           @click="()=>{ScrollTo();status.userOrder = -1}">
        <arrow-left height="1em" status="" width="1em"/>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Tmv2Chart from "@/components/Tmv2ChartWithoutDataSet.vue";
import CandlestickChart from "@/components/modules/candlestickChart.vue";
import {useHead} from "@vueuse/head";
import ArrowLeft from "@/icons/ArrowLeft.vue";
import InfoCircleFill from "@/icons/InfoCircleFill.vue";
import DownloadIcon from "@/icons/DownloadIcon.vue";
import {ScrollTo, Notice} from "@/share/Tools";
import {useStore} from "@/store";
import {computed, onMounted, reactive, Ref, ref, toRefs, watch} from "vue";
import {request} from "@/share/Fetch";
import {ApiLoveLiveData, ApiLoveLiveDateList} from "@/type/Api";
import SinglePageHeader from "@/components/SinglePageHeader.vue";

export default {
  name: "loveliveTrends",
  setup () {
    useHead({
      title: 'LoveLive! Trends',
      meta: [{
        name: "theme-color",
        content: "#1da1f2"
      }]
    })

    const color = {"Aqours": "#32aaff", "虹ヶ咲学園": "#f39800", "Liella!": "#a5469c",}
    const teams = [{"text": "Aqours", "value": "Aqours"},{"text": "虹ヶ咲学園", "value": "虹ヶ咲学園"},{"text": "Liella!", "value": "Liella!"},]
    const selectedTeams = ref(new Set(["Aqours", "虹ヶ咲学園", "Liella!"]))

    const store = useStore()
    const settings = computed(() => store.state.settings)

    const state = reactive<{
      dateList: Ref<ApiLoveLiveDateList>
      trendsData: Ref<ApiLoveLiveData>
      status: Ref<{
        userOrder: number
        value: string
        displayTips: boolean
        dateOrder: number
      }>
    }>({
      trendsData: ref({data: [], range: {start: 0, end: 0}}),
      status: ref({
        userOrder: -1,
        value: "overview",
        displayTips: false,
        dateOrder: 0,
      }),
      dateList: ref([]),
    })

    const getDateInfo = () => {
      request<ApiLoveLiveDateList>(settings.value.basePath + '/static/lovelive_trends/date.json?' + Math.random()).then(response => {
        if (response.length) {
          state.dateList = response
          getData()
        } else {
          Notice("没有数据", 'error')
        }
      }).catch(e => {
        Notice(String(e), 'error')
      })
    }
    const getData = () => {
      request<ApiLoveLiveData>(settings.value.basePath + '/static/lovelive_trends/' + state.dateList[state.status.dateOrder] + '.json').then(response => {
        state.trendsData = response
      }).catch(e => {
        Notice(String(e), 'error')
      })
    }

    const tableData = computed((): {
          order: number
          name: string
          display_name: string[]
          followers: number
          followers_add: number
          followers_growth_rate: string
          tweets_count: number
          origin_ratio: string
          team: string
        }[] => state.trendsData.data.filter(y => selectedTeams.value.has(y.team)).map((x, order) => ({
        order,
        name: x.name,
        display_name: x.display_name,
        followers: x.followers[6].end,
        followers_add: x.followers[6].end - x.followers[0].start,
        followers_growth_rate: Math.floor(((x.followers[6].end - x.followers[0].start) / x.followers[0].start) * 10000) / 100 + '%',
        tweets_count: x.tweets.count,
        origin_ratio: Math.floor(x.tweets.origin / x.tweets.count * 100) + '%',
        team: x.team
      }))
    )

    const timeCountRows = computed(() => {
      let data: {time: number, count: number}[] = []
      state.trendsData.data.filter(y => selectedTeams.value.has(y.team)).map(x => {
        x.tweets.hour_count.map((count, time) => {
          if (data[time]) {
            data[time].count += count
          } else {
            data[time] = {time, count: count}
          }
        })
      })
      return data
    })
    const userData = computed(() => {
      let label: {[p: 'day' | string]: string | number} = {day: "日期"}
      let color: string[] = []
      let data: {[p: 'day' | string]: string | number}[] = [{day: "星期日"}, {day: "星期一"}, {day: "星期二"}, {day: "星期三"}, {day: "星期四"}, {day: "星期五"}, {day: "星期六"}]
      let count_data: {[p: 'day' | string]: string | number}[] = [{day: "星期日"}, {day: "星期一"}, {day: "星期二"}, {day: "星期三"}, {day: "星期四"}, {day: "星期五"}, {day: "星期六"}]
      state.trendsData.data.filter(y => selectedTeams.value.has(y.team)).map(x => {
        label[x.name] = x.name_cn
        color.push(x.color)
        x.followers.map((y, order) => {
          data[order][x.name] = y.end - y.start
          count_data[order][x.name] = y.end
        })
      })
      return {label, color, data, count_data}
    })

    const createDate = (timestamp: number) => {
      let date = new Date(timestamp * 1000)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    }
    //这哪来干嘛的
    //const splitData = computed((rawData) => {
    //  let categoryData = [];
    //  let values = []
    //  for (let i = 0; i < rawData.length; i++) {
    //    categoryData.push(rawData[i].splice(0, 1)[0]);
    //    values.push(rawData[i])
    //  }
    //  return {categoryData, values};
    //})

    onMounted(() => {
      getDateInfo()
    })

    watch(() => state.status.dateOrder, () => {getData()}, {deep: true})

    return {...toRefs(state), ScrollTo, Notice, color, teams, selectedTeams, createDate, userData, timeCountRows, tableData, settings}
  },
  components: {SinglePageHeader, DownloadIcon, InfoCircleFill, ArrowLeft, CandlestickChart, Tmv2Chart},
}
</script>

<style scoped>

</style>
