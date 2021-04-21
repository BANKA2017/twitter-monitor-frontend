<template>
  <div id="lovelive-trends">
    <div class="jumbotron jumbotron-fluid" style="background-color: #1da1f2">
      <div class="container">
        <h1 class="display-4" style="color: white">LoveLive! Trends</h1>
        <p class="lead" style="color: white" v-if="trendsData.range.start">{{ createDate(trendsData.range.start) }} ~ {{ createDate(trendsData.range.end) }}</p>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-lg-2 mb-4">
          <el-tag role="button" :color="selectedTeams.indexOf(name) === -1 ? '#ffffff' : colorInfo" :class="{'text-white': selectedTeams.indexOf(name) !== -1,  'btn-block': true}" v-for="(colorInfo, name) in color" :key="name" @click="selectedTeams.indexOf(name) === -1 ? selectedTeams.push(name) : selectedTeams.splice(selectedTeams.indexOf(name), 1)">
            {{ name }}
          </el-tag>
          <button :class="{'btn': true, 'btn-block': true, 'btn-outline-primary': true, 'active': status.displayTips}" @click="status.displayTips = !status.displayTips">说明 <i class="el-icon-info"></i></button>
          <a class="btn btn-block btn-outline-primary" :href="basePath + '/static/lovelive_trends/' + dateList[status.dateOrder] + '.json'" target="_blank">下载数据 <i class="el-icon-download"></i></a>
        </div>
        <div class="col-lg-8 mb-4">
          <div class="card" v-show="status.displayTips">
            <div class="card-body">
              <h5 class="card-title">说明</h5>
              <h6 class="card-subtitle mb-2 text-muted">如何使用本页</h6>
              <ul class="card-body">
                <li>目前本页仍在测试，界面及数据结构不代表最终产品……至少它能用了</li>
                <li>点击 下载数据 按钮可以下载当前所展示的图表所用到的原始数据</li>
                <li>点击侧边或顶上组合名称可以进行数据筛选，目前仍然非常粗糙……至少能用</li>
                <li>本页非常粗糙的另一个原因是我没有头绪，不知道应该展示些什么，如果您有更多的想法，请告诉我；如果本站的任何账号有错误，请指正</li>
                <li>本页仅提供 LoveLive! 企划中的 Aqours、虹ヶ咲学園 以及 Liella! 相关人士的数据，不包含 μ's</li>
                <li>更新时间为东京时间的每周一零点到一点不定，取决于自动处理脚本的处理速度（会越来越快的）</li>
              </ul>
            </div>
          </div>
          <template v-if="trendsData === {}" >
            <p class="text-center">Please wait...</p>
          </template>
          <template v-if="selectedTeams.length === 0" >
            <p class="text-center">请选中一个组合</p>
          </template>
          <template v-else>
            <template v-if="status.value === 'overview'" >
              <tmv2-chart :chart-rows="userData.data" :colors="userData.color" :label-map="userData.label" chart-type="VeLineChart" chartHeight="500" title="关注数变动"/>
              <el-table ref="accountData" v-loading="!trendsData.data.length" :data="tableData" :default-sort="{prop: 'followers_add', order: 'descending'}" style="width: 100%">
                <el-table-column label="用户名" prop="display_name"></el-table-column>
                <el-table-column label="关注者数" prop="followers" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="关注变化量" prop="followers_add" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="发推数" prop="tweets_count" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="原创占比" prop="origin_ratio" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="组" prop="team">
                  <template slot-scope="scope">
                    <el-tag :color="color[scope.row.team]" class="text-white" disable-transitions>
                      {{ scope.row.team }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                  <template slot-scope="scope">
                    <!--<el-button @click="() => {status.name = scope.row.name; status.value = 'info'}" type="text" size="small">详情</el-button>-->
                    <el-button @click="$router.push(`/` + scope.row.name + `/all`)" type="text" size="small">主页</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <template >
              <div class="row no-gutters my-4">
                <tmv2-chart class="col-md-12" :chart-rows="timeCountRows" :label-map="{time: '发推时间', count: '数量'}" :y-axis="{type: 'value', name: '推文数量'}" chartHeight="260" title="发推时间段"/>
              </div>
            </template>
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
  </div>
</template>

<script>
import Tmv2Chart from "@/components/modules/tmv2Chart";
import axios from 'axios'
export default {
  name: "loveliveTrends",
  components: {Tmv2Chart},
  data: () => ({
    trendsData: {data: [], range: {}},
    color: {
      "Aqours": "#32aaff",
      "虹ヶ咲学園": "#f39800",
      "Liella!": "#a5469c",
    },
    teams: [{"text": "Aqours", "value": "Aqours"},{"text": "虹ヶ咲学園", "value": "虹ヶ咲学園"},{"text": "Liella!", "value": "Liella!"},],
    selectedTeams: ["Aqours", "虹ヶ咲学園", "Liella!"],
    status: {
      name: "",
      value: "overview",
      displayTips: false,
      dateOrder: 0,
    },
    dateList: [],
  }),
  metaInfo () {
    return {
      title: "LoveLive! Trends",
      meta: [{
        name: "theme-color",
        content: "#1da1f2"
      }]
    }
  },
  watch: {
    "status.dateOrder": {
      handler: function () {
        this.getData()
      },
      deep: true,
    }
  },
  mounted: function () {
    this.getDateInfo()
  },
  computed: {
    tableData: function () {
      let data = []
      this.trendsData.data.map(x => {
        if (this.selectedTeams.indexOf(x.team) > -1) {
          data.push({
            name: x.name,
            display_name: x.display_name,
            followers: x.followers[6].end,
            followers_add: x.followers[6].end - x.followers[0].start,
            tweets_count: x.tweets.count,
            origin_ratio: Math.floor(x.tweets.origin / x.tweets.count * 100) + '%',
            team: x.team
          })
        }
      })
      return data
    },
    timeCountRows: function () {
      let data = []
      this.trendsData.data.map(x => {
        if (this.selectedTeams.indexOf(x.team) > -1) {
          x.tweets.hour_count.map((count, time) => {
            if (data[time]) {
              data[time].count += count
            } else {
              data[time] = {time: time, count: count}
            }
          })
        }
      })
      return data
    },
    userData: function () {
      let label = {}
      let color = []
      let data = [{day: "星期一"}, {day: "星期二"}, {day: "星期三"}, {day: "星期四"}, {day: "星期五"}, {day: "星期六"}, {day: "星期日"}]
      this.trendsData.data.map(x => {
        if (this.selectedTeams.indexOf(x.team) > -1) {
          label[x.name] = x.name_cn
          color.push(x.color)
          x.followers.map((y, order) => {
            data[order][x.name] = y.end - y.start
          })
        }
      })
      return {label: label, color: color, data: data}
    }
  },
  methods: {
    getDateInfo: function () {
      axios.get(this.basePath + (process.env.NODE_ENV === "development" ? '/proxy.php?filename=lovelive_date' : '/static/lovelive_trends/date.json?' + Math.random())).then(response => {
        this.dateList = response.data.reverse()
        if (this.dateList.length > 0) {
          this.getData()
        } else {
          this.notice("没有数据", 'error')
        }
      }).catch(e => this.notice(e, 'error'))
    },
    getData: function () {
      axios.get(this.basePath + (process.env.NODE_ENV === "development" ? '/proxy.php?filename=lovelive_data' : '/static/lovelive_trends/' + this.dateList[this.status.dateOrder] + '.json')).then(response => {
        this.trendsData = response.data
      }).catch(e => this.notice(e, 'error'))
    },
    createDate: function (timestamp) {
      let date = new Date(timestamp * 1000)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    },
    splitData: function(rawData) {
      let categoryData = [];
      let values = []
      for (let i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i])
      }
      return {
        categoryData: categoryData,
        values: values
      };
    }
  },
}
</script>

<style scoped>

</style>
