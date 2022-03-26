<template>
  <div id="annual2020">
    <single-page-header title="Twitter Monitor" sub-title="2020 年度数据" />
    <div v-if="!status" class="text-center mb-4"><div class="spinner-border"></div></div>
    <div class="container" v-else>
      <div class="row">
        <div class="col-md-10 offset-md-1">
          <h3>前言</h3>
          <p>2020年，是不平凡的一年，疫情使得我有更多的机会和精力处理本站的事务。那么 Twitter Monitor 究竟做了些什么呢？</p>
          <ul class="ms-3">
            <li>进行了 1 次大更，前端改用 Webpack ，重新设计了数据库和api，更新了爬虫</li>
            <li>进行了 2 次迁移，由于旧服务器即将到期，本站进行了两次迁移，同时与<a href="https://bangdream.fun" target="_blank">主站</a>拆分，现运行于 kimsufi
              独服
            </li>
            <li>收拾了一些历史遗留问题，比如未能正确进行索引导致数据库检索速度极慢，一度达到 20s/query</li>
            <li>收集了大量数据以后整点东西出来，比如本页</li>
          </ul>
          <hr class="my-4">
          <h3 class="mb-3">变动</h3>
          <h5>帐号</h5>
          <p>比起<router-link to="/i/events/2019/">2019年</router-link>，2020年站内共有86个帐号，其中85个是开放账号，可以直接在站内点击访问；1个是隐藏帐号，需要使用对应链接访问。新添加的帐号主要是两个企划在
            2020 年新发布出来的企划成员 (<span class="text-success">12</span>) ，新游戏的官推 (<span class="text-success">1</span>)
            ，更换错误的帐号 (<span class="text-success">1</span>) 以及私人原因不公开的隐藏账号 (<span class="text-success">1</span>)
            ；删除方面主要是早期添加的各种官推 (<span class="text-danger">8</span>) 和更换错误的账号 (<span class="text-danger">1</span>)
            。总而言之，帐号的增减请参阅下表</p>
          <div class="row">
            <div class="col-md-6">
              <p class="text-muted text-center">增加账号 (<span class="text-success">{{ userAddList.length }}</span>)</p>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                  <tr>
                    <th scope="col">用户名</th>
                    <th scope="col">id</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(userInfo, order) in userAddList" :key="order" class="table-success">
                    <th scope="row">{{ userInfo.display_name }}</th>
                    <td v-if="userInfo.name === '[ 已隐藏 ]'">[ 已隐藏 ]</td>
                    <td v-else>
                      <router-link :to="`/` + userInfo.name + `/all`" class="text-decoration-none text-dark">
                        @{{ userInfo.name }}
                      </router-link>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="col-md-6">
              <p class="text-muted text-center">删除账号 (<span class="text-danger">{{ userDeleteList.length }}</span>)</p>
              <table class="table">
                <thead>
                <tr>
                  <th scope="col">用户名</th>
                  <th scope="col">id</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(userInfo, order) in userDeleteList" :key="order" class="table-danger">
                  <th scope="row">{{ userInfo.display_name }}</th>
                  <td><a :href="`https://twitter.com/` + userInfo.name" class="text-decoration-none text-dark" target="_blank">@{{ userInfo.name }}</a></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p>其实我还挺想跟去年的数据做个对比，但懒（啦啦啦~~~）</p>
          <h5>投票</h5>
          <p>投票不多，也不难找，粗略翻了一下就找到参与人数最多的投票了……关于送啥的……果然免（bai）费（piao）才是人气所在（</p>
          <tweet :order="-1" :tweet="pollTopTweet" class="col-md-8 offset-md-2" display="all" display-type="timeline"/>
          <h5 class="my-3">用户数据变动</h5>
          <el-table ref="accountData" v-loading="!userData.length" :data="userData" :default-sort="{prop: 'followers_add', order: 'descending'}" style="width: 100%">
            <el-table-column label="用户名" prop="display_name"></el-table-column>
            <el-table-column label="关注数" prop="followers" show-overflow-tooltip sortable></el-table-column>
            <el-table-column label="关注变化量" prop="followers_add" show-overflow-tooltip sortable></el-table-column>
            <el-table-column label="总推文数" prop="statuses_count" show-overflow-tooltip sortable></el-table-column>
            <el-table-column label="推文变化量" prop="statuses_count_add" show-overflow-tooltip sortable></el-table-column>
            <el-table-column label="监听天数" prop="time" sortable></el-table-column>
            <el-table-column :filter-method="filterTag" :filters="projects" filter-placement="bottom-end" header-align="center" label="组" prop="group">
              <template #default="scope">
                <el-tag v-for="group in scope.row.group" :key="group" :type="colorForGroup[group]" disable-transitions>
                  {{ group }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <h5 class="my-4">标签排行</h5>
          <el-table ref="accountData" v-loading="!hashTagList.length" :data="hashTagList" :default-sort="{prop: 'count', order: 'descending'}" style="width: 100%">
            <el-table-column label="名称" prop="text"></el-table-column>
            <el-table-column label="统计" prop="count" show-overflow-tooltip sortable></el-table-column>
          </el-table>
          <hr class="my-4">
          <h3>质量</h3>
          <p>这是3月更新中新增加的服务状态监控，其中最近24小时的状态可以在
            <router-link to="/i/status">状态</router-link>
            查看
          </p>
          <p>除了服务器迁移和六月初的强制拔线，本站基本没有出现过长时间停机，但由于对Twitter的请求数量过多，我们经常会得到两种错误：<span class="text-monospace">Rate limit exceeded</span>
            和 <span class="text-monospace">Bad guest token.</span></p>
          <p>下面就是没什么用的数据啦</p>
          <tmv2-chart :chart-rows="serverStatusChartMeta.serverStatusTotalTweets" :colors="serverStatusColor.serverStatusTotalTweets" :label-map="serverStatusLabel.totalTweets" chart-type="line"></tmv2-chart>
          <tmv2-chart :chart-rows="serverStatusChartMeta.serverStatusTotalTime" :colors="serverStatusColor.serverStatusTotalTime" :label-map="serverStatusLabel.totalTime" :y-axis="{type: 'log', name: '秒', scale: true}" chart-type="line"></tmv2-chart>
          <tmv2-chart :chart-rows="serverStatusChartMeta.serverStatusTotalSuccessRate" :colors="serverStatusColor.serverStatusTotalSuccessRate" :label-map="serverStatusLabel.successRate" chart-type="line"></tmv2-chart>
          <h3 class="my-3">其他</h3>
          <p><a class="text-decoration-none text-dark" href="/static/db/annual2020.json" target="_blank">本页数据</a></p>
        </div>
      </div>
    </div>
    <p class="lead text-center mb-4">Project Twitter Monitor</p>
  </div>
</template>

<script lang="ts">
import Tweet from "@/components/TweetItem.vue"
import Tmv2Chart from "@/components/Tmv2ChartWithoutDataSet.vue"
import {useHead} from "@vueuse/head";
import {ScrollTo, Notice} from "@/share/Tools";
import SinglePageHeader from "@/components/SinglePageHeader.vue";
import {onMounted, reactive, ref, Ref, toRefs, defineComponent} from "vue";
import {request} from "@/share/Fetch";
import {ApiAnnual2020} from "@/type/Api";

export default defineComponent({
  name: "annual2020",
  setup() {
    useHead({
      title: '2020统计',
      meta: [{
        name: "theme-color",
        content: "#1da1f2"
      }]
    })

    const serverStatusLabel = {
      totalTweets: {
        "date": "日期",
        "total_tweets": "每日处理推文数",
        "tweets_count": "总处理推文数",
        "avg_tweets": "平均每次处理条数"
      },
      totalTime: {
        "date": "日期",
        "total_time_cost": "总耗时",
        "max_time_cost": "最大耗时",
        "min_time_cost": "最小耗时",
        "avg_time_cost": "平均耗时",
      },
      successRate: {
        "date": "日期",
        "success_rate": "成功率",
      },
    }
    const serverStatusColor = {
      serverStatusTotalTweets: ['#19d4ae', '#d87a80', '#5ab1ef'],
      serverStatusTotalTime: ['#5ab1ef', '#fa6e86', '#ffb980', '#c4b4e4'],
      serverStatusTotalSuccessRate: ['#0067a6'],
    }

    const colorForGroup = {"BanGDream!": "", "ARGONAVIS": "success", "LoveLive!": "warning", "艦これ": "danger"}

    const filterTag = (value: string, row: any) => {
      for (let x in row.group) {
        if (x === value) {return true}
      }
      return false
    }

    const state = reactive<{
      status: Ref<boolean>,
      userAddList: ApiAnnual2020["userAddList"]
      userDeleteList: ApiAnnual2020["userDeleteList"]
      pollTopTweet: ApiAnnual2020["pollTopTweet"] | {}
      userData: ApiAnnual2020["userData"]
      projects: ApiAnnual2020["projects"]
      hashTagList: ApiAnnual2020["hashTagList"]
      serverStatusMeta: ApiAnnual2020["serverStatusMeta"]
      serverStatusChartMeta: {
        serverStatusTotalTweets: {date: string; total_tweets: number; tweets_count: number; avg_tweets: number}[],
        serverStatusTotalTime: {date: string; total_time_cost: number; max_time_cost: number; min_time_cost: number; avg_time_cost: number}[],
        serverStatusTotalSuccessRate: {date: string; success_rate: number}[],
      },
    }>({
      status: ref(false),
      userAddList: [],
      userDeleteList: [],
      pollTopTweet: {},
      userData: [],
      projects: [],
      hashTagList: [],
      serverStatusMeta: [],
      serverStatusChartMeta: {
        serverStatusTotalTweets: [],
        serverStatusTotalTime: [],
        serverStatusTotalSuccessRate: [],
      },
    })

    onMounted(() => {
      request<ApiAnnual2020>('/static/db/annual2020.json').then(response => {
        state.userAddList = response.userAddList
        state.userDeleteList = response.userDeleteList
        state.pollTopTweet = response.pollTopTweet
        state.userData = response.userData
        state.projects = response.projects
        state.hashTagList = response.hashTagList
        state.serverStatusMeta = response.serverStatusMeta
        state.serverStatusMeta.map(x => {
          state.serverStatusChartMeta.serverStatusTotalTweets.push({
            date: x.date,
            total_tweets: x.total_tweets,
            tweets_count: x.tweets_count,
            avg_tweets: x.avg_tweets,
          })
          state.serverStatusChartMeta.serverStatusTotalTime.push({
            date: x.date,
            total_time_cost: x.total_time_cost,
            max_time_cost: x.max_time_cost,
            min_time_cost: x.min_time_cost,
            avg_time_cost: x.avg_time_cost,
          })
          state.serverStatusChartMeta.serverStatusTotalSuccessRate.push({
            date: x.date,
            success_rate: x.success_rate,
          })
        })
        state.status = true
        ScrollTo()
      }).catch(e => {
        Notice(String(e), 'error')
      })
    })

    return {
      ...toRefs(state),
      serverStatusLabel,
      serverStatusColor,
      colorForGroup,
      filterTag
    }
  },
  components: {SinglePageHeader, Tmv2Chart, Tweet},
})
</script>

<style scoped>

</style>
