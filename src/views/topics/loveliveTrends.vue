<template>
  <div id="lovelive-trends">
    <div class="container mt-5">
      <div class="row">
        <div class="col-lg-2 mb-4">
          <div class="d-grid gap-2" style="position: sticky; top: 1.5rem">
            <button role="button" :class="{'text-white': selectedTeams.has(name), 'btn': true}" :style="{'background-color': selectedTeams.has(name) ? colorInfo : '#ffffff'}" v-for="(colorInfo, name) in color" :key="name" @click="selectedTeams.has(name) ? selectedTeams.delete(name) : selectedTeams.add(name)">
              {{ name }}
            </button>
            <button :class="{'btn': true, 'btn-outline-primary': true, 'active': state.status.displayTips}" @click="state.status.displayTips = !state.status.displayTips">说明 <info-circle-fill height="1em" status="" width="1em" /></button>
            <button class="btn btn-outline-primary" @click="H2C(overview, 'lovelive_trends.png')">保存图片</button>
            <a :href="store.getters.getBasePath + '/static/lovelive_trends/' + state.status.date + '.json'" class="btn btn-outline-primary" target="_blank">下载数据 <download-icon height="1em" status="" width="1em" /></a>
          </div>
        </div>
        <div class="col-lg-8 mb-4">
          <div class="card" v-show="state.status.displayTips">
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
          <template v-if="Object.values(state.trendsData).length === 0" >
            <p class="text-center">Please wait...</p>
          </template>
          <template v-if="selectedTeams.size === 0" >
            <p class="text-center">请选中一个组合</p>
          </template>
          <template v-else-if="state.status.name !== ''" >
            <el-skeleton :loading="Object.values(state.trendsData).length === 0" animated v-if="Object.values(state.trendsData).length === 0" />
            <p v-else-if="selectedAccountData.length === 0" >没有这个帐号</p>
            <div v-else ref="overview">
              <p class="display-4 mx-2">{{ selectedAccountData[0].name_cn }}</p>
              <p class="mx-2">
                <router-link :to="`/`+ selectedAccountData[0].name +`/all`" class="text-decoration-none text-muted">@{{ selectedAccountData[0].name }}</router-link> <span :style="{'background-color': selectedAccountData[0].color}" class="badge rounded-pill text-white">{{ selectedAccountData[0].color }}</span> <span :style="{'background-color': color[selectedAccountData[0].team]}" class="badge rounded-pill text-white">{{ selectedAccountData[0].team }}</span>
              </p>
              <div class="container-fluid">
                <div class="row">
                  <div class="col-md-6 mb-4">
                    <candlestick-chart :set-option="{notMerge: true}" :data-array="selectedAccountData[0].followers.map(x => [x.start, x.end, x.lowest, x.highest])" :x-axis-data="['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']" title="关注数K线图"/>
                  </div>
                  <div class="col-md-6 mb-4">
                    <tmv2-chart :chart-rows="selectedAccountData[0].tweets.hour_count.map((count, time) => ({time: time, count: count}))" :label-map="{time: '发推时间', count: '数量'}" :y-axis="{type: 'value', name: '推文数量'}" chartHeight="260px" class="col-md-12" title="发推时间段"/>
                  </div>
                  <div class="col-md-6 mb-4">
                    <label class="text-muted" for="tag-list">Tag 统计</label>
                    <div id="tag-list" class="list-group">
                      <router-link v-for="(count, tagName) in selectedAccountData[0].tweets.tag" :key="tagName" :to="`/hashtag/` + tagName" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        #{{ tagName }}
                        <span class="badge bg-primary rounded-pill">{{ count }}</span>
                      </router-link>
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">
                    <label class="text-muted" for="link-list">链接统计</label>
                    <div id="link-list" class="list-group">
                      <div v-for="(count, linkName) in selectedAccountData[0].tweets.link" :key="linkName" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        {{ linkName }}
                        <span class="badge bg-danger rounded-pill">{{ count }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-small fst-italic">
                <span class="text-muted">Project Twitter Monitor</span><br>
                <a class="text-small fst-italic" href="https://tm.bangdream.fun" target="_blank">https://tm.bangdream.fun</a>
              </p>
            </div>
          </template>
          <template v-else>
            <div v-if="state.status.value === 'overview'" ref="overview">
              <single-page-header title="LoveLive! Trends" :sub-title="state.trendsData.range.start ? (createDate(state.trendsData.range.start) + '~' + createDate(state.trendsData.range.end)) : ''" padding="5vw" />
              <tmv2-chart :chart-rows="userData.data" :colors="userData.color" :label-map="userData.label" chart-type="line" chartHeight="500px" title="关注数变动" :set-option="{notMerge: true}"/>
              <tmv2-chart :chart-rows="userData.count_data" :colors="userData.color" :label-map="userData.label" chart-type="line" chartHeight="500px" title="关注数" :set-option="{notMerge: true}"/>
              <sun-burst-chart class="mb-2" title="涨粉占比" height="500px" :data="accountDataForSunBurst" :levels="sunBurstLevels" />
              <word-cloud-chart class="mb-2" title="Tags" :data="wordCloud" height="470px" />
              <el-table class="mb-2" ref="accountData" v-loading="!state.trendsData.data.length" :data="tableData" :default-sort="{prop: 'followers_add', order: 'descending'}" style="cursor: pointer; width: 100%" @row-click="(row) => {ScrollTo();$router.push('/i/topics/lovelive_trends/' + row.name)}">
                <el-table-column label="名称">
                  <template #default="scope">
                    <!--<el-button @click="() => {state.status.name = scope.row.name; state.status.value = 'info'}" type="text" size="small">详情</el-button>-->
                    <span style="font-size: 12px" class="text-muted">{{ scope.row.display_name[0] }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="关注者数" prop="followers" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="关注变化量" prop="followers_add" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="关注增长率" prop="followers_growth_rate" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="发推数" prop="tweets_count" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="组" prop="team" style="">
                  <template #default="scope">
                    <span :style="{'background-color': color[scope.row.team], padding: '5px 11px', 'font-size': '12px', 'border-radius': '3px',}" class="text-white">
                      {{ scope.row.team }}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
              <tmv2-chart :chart-rows="timeCountRows" :label-map="{time: '发推时间', count: '数量'}" :y-axis="{type: 'value', name: '推文数量'}" chartHeight="260px" class="mb-2" title="发推时间段"/>
              <p class="text-small fst-italic">
                <span class="text-muted">Project Twitter Monitor</span><br>
                <a class="text-small fst-italic" href="https://tm.bangdream.fun" target="_blank">https://tm.bangdream.fun</a>
              </p>
            </div>
          </template>
        </div>
        <div class="col-lg-2">
          <div class="list-group mb-2">
            <button type="button" :class="{'list-group-item': true, 'list-group-item-action': true, active: year === state.status.year}" v-for="year in state.yearList" :key="year" @click="state.status.year = year">
              {{ year }}
            </button>
          </div>
          <div class="list-group">
            <button type="button" :class="{'list-group-item': true, 'list-group-item-action': true, active: date === state.status.date}" v-for="date in state.dateList.filter(x => x.slice(0, 4) === state.status.year)" :key="date" @click="state.status.date = date">
              {{ date }}
            </button>
          </div>
          <div class="text-center my-4"> >_ Twitter Monitor</div>
        </div>
      </div>
    </div>
    <transition name="el-fade-in">
      <div v-if="state.status.name !== ''" class="el-backtop" style="right: 40px; bottom: 90px"
           @click="()=>{ScrollTo(0);$router.go(-1)}">
        <arrow-left height="1em" status="" width="1em"/>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import Tmv2Chart from "@/components/Charts/Tmv2ChartWithoutDataSet.vue";
import CandlestickChart from "@/components/modules/candlestickChart.vue";
import {useHead} from "@vueuse/head";
import ArrowLeft from "@/icons/ArrowLeft.vue";
import InfoCircleFill from "@/icons/InfoCircleFill.vue";
import DownloadIcon from "@/icons/DownloadIcon.vue";
import {ScrollTo, Notice, H2C} from "@/share/Tools";
import {useStore} from "@/store";
import {computed, reactive, Ref, ref, watch} from "vue";
import {request} from "@/share/Fetch";
import {ApiLoveLiveData, ApiLoveLiveDateList} from "@/type/Api";
import SinglePageHeader from "@/components/SinglePageHeader.vue";
import {sunBurstType} from "@/type/Content";
import SunBurstChart from "@/components/Charts/SunBurstChart.vue";
import {onBeforeRouteUpdate, useRoute} from "vue-router";
import WordCloudChart from "@/components/Charts/WordCloudChart.vue";
import FullText from "@/components/FullText.vue";

useHead({
  title: 'LoveLive! Trends',
})

const overview = ref<HTMLElement>()
const color: {[p: string]: string} = {"Aqours": "#1AB1F6", "虹ヶ咲学園": "#F8B657", "Liella!": "#DA57D8",}
const teams = [{"text": "Aqours", "value": "Aqours"},{"text": "虹ヶ咲学園", "value": "虹ヶ咲学園"},{"text": "Liella!", "value": "Liella!"},]
const selectedTeams = ref(new Set(["Aqours", "虹ヶ咲学園", "Liella!"]))
const sunBurstLevels = [
  {},
  {
    r0: '10%',
    r: '37%',
    itemStyle: {borderWidth: 2},
    label: {align: 'right',}
  },
  {
    r0: '37%',
    r: '57%',
    label: {position: 'outside', silent: false},
    itemStyle: {borderWidth: 3}
  }]

const store = useStore()
const state = reactive<{
  dateList: Ref<ApiLoveLiveDateList>
  trendsData: Ref<ApiLoveLiveData>
  status: Ref<{
    name: string
    value: string
    displayTips: boolean
    date: string
    year: string
  }>
  yearList: string[]
}>({
  trendsData: ref({data: [], range: {start: 0, end: 0}}),
  status: ref({
    name: '',
    value: "overview",
    displayTips: false,
    date: '',
    year: ""
  }),
  yearList: [],
  dateList: ref([]),
})

const getDateInfo = () => {
  request<ApiLoveLiveDateList>(store.getters.getBasePath + '/static/lovelive_trends/date.json?' + Math.random()).then(response => {
    if (response.length) {
      state.dateList = response
      state.yearList = getYearList(response)
      state.status.year = state.yearList[0] || ""
      state.status.date = state.dateList[0] || ""
    } else {
      Notice("没有数据", 'error')
    }
  }).catch(e => {
    Notice(String(e), 'error')
  })
}
const getData = () => {
  request<ApiLoveLiveData>(store.getters.getBasePath + '/static/lovelive_trends/' + state.status.date + '.json').then(response => {
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
      team: "Aqours"  | "虹ヶ咲学園" | "Liella!"
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

const accountDataForSunBurst = computed(() => {
  let tmpSunBurstData: { [p: string]: sunBurstType } = {"Aqours": {}, "虹ヶ咲学園": {}, "Liella!": {},}
  for (const key in tableData.value) {
    const accountData = tableData.value[key]
    if (Object.keys(tmpSunBurstData[accountData.team]).length === 0) {
      tmpSunBurstData[accountData.team] = {
        name: accountData.team,
        itemStyle: {color: color[accountData.team]},
        children: []
      }
    }
    tmpSunBurstData[accountData.team].children.push({
      name: accountData.display_name[0],
      itemStyle: {color: userData.value.color[key]},
      value: accountData.followers_add
    })
  }
  return Object.values(tmpSunBurstData)
})

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

const getYearList = (dateList: ApiLoveLiveDateList): string[] => {
  const tmpList: string[] = []
  let tmpYear: string
  dateList.map(x => {
    tmpYear = x.slice(0, 4)
    if (!tmpList.includes(tmpYear)) {
      tmpList.push(tmpYear)
    }
  })

  return tmpList
}

const selectedAccountData = computed(() => {
  if (state.status.name === '') {return []}
  return state.trendsData.data.filter(account => account.name === state.status.name)
})

const wordCloud = computed(() => {
  let word_cloud: {[p: string]: {name: string; value: number}} = {}
  state.trendsData.data.filter(y => selectedTeams.value.has(y.team)).forEach(accountData => {
    for (let tag in accountData.tweets.tag) {
      if (!word_cloud[tag]) {
        word_cloud[tag] = {name: tag, value: accountData.tweets.tag[tag]}
      } else {
        word_cloud[tag].value += accountData.tweets.tag[tag]
      }
    }
  })
  return Object.values(word_cloud)
})

const route = useRoute()
onBeforeRouteUpdate((to) => {
  if (to.params.name && to.params.name !== '') {
    state.status.name = to.params.name.toString()
  } else {
    state.status.name = ''
  }
})
if (route.params.name && route.params.name !== '') {
  state.status.name = route.params.name.toString()
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

getDateInfo()
watch(() => state.status.date, () => {getData()})

</script>

<style scoped>

</style>
