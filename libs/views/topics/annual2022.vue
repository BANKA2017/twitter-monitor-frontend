<template xmlns="http://www.w3.org/1999/html">
  <div id="annual2022">
    <el-collapse-transition >
      <div v-if="state.loading" style="background-color: #1da1f2; min-height: 100vh" class="text-center">
        <p class="text-white" style="font-size: 14vh; padding: 20vh 0 0 0;">Twitter Monitor</p>
        <p class="text-white" style="font-size: 8vh;">2022</p>
        <div class="progress" style="height: 5px; max-width: 50vw; margin: auto">
          <div class="progress-bar" role="progressbar" id="progress" :style="{'width': state.progress + '%', 'background-color': '#1da1f2'}" :aria-valuenow="state.progress" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
      <div v-else >
        <single-page-header title="Twitter Monitor" sub-title="2022 年度报告" />

        <div class="container">
          <div class="row">
            <div class="col-12">
              <p class="text-muted">
                <small>* 如无特殊注明，统计所使用的时区为东九区(GMT+9)</small><br>
                <small>* 建议使用宽屏并缩放到<code class="fw-bold">90%</code>浏览，否则可能会出现图表显示不全</small><br>
                <small>* 本页对设备性能要求较高，使用性能不足的设备浏览可能会在处理数据时有卡顿感，处理完成后即可正常浏览</small>
              </p>
              <h3 class="sticky-title">TL;DR</h3>
              <p class="text-muted">平淡无奇又一年</p>
              <ul class="ms-3">
                <li>使用 <code>NodeJS</code> 重构爬虫以及后端，实现了所有 api 的大一统；增强了PHP时代一直被隐藏的online api，用户能够直接收听 Space 和收看 Broadcast</li>
                <li>加了很多很多人</li>
                <li>Twitter 收购案导致了一系列的连锁反应，我们开始推进 Twitter Archiver 的开发用以协助备份大量内容</li>
              </ul>
              <h3 class="sticky-title">总概</h3>
              <p class="text-muted">今年加了很多人……</p>
              <p>
                2022年下半年我们将爬虫迁移到<code>NodeJS</code>后先后增加了<span class="text-success">{{state.userAddList.length}}</span>个帐号；<br>
                而在现有的账号中，有<span class="text-warning">1</span>个改名，<span class="text-primary">1</span>个从封号状态下恢复
              </p>
              <div style="font-size: 1.5em;">
                <router-link :to="'/' + account.name + '/all'" class="badge bg-success text-white" style="margin: 2px;" v-for="account in state.userAddList" :key="account.name">{{account.display_name}}<span style="font-size: 0.8em;">(@{{ account.name }})</span></router-link>
                <router-link :to="'/' + account.name + '/all'" class="badge bg-warning text-white" style="margin: 2px;" v-for="account in state.userRenameList" :key="account.name">{{account.display_name}}(@{{ account.old_name }} -> @{{ account.name }})</router-link>
                <router-link :to="'/' + account.name + '/all'" class="badge bg-primary text-white" style="margin: 2px;" v-for="account in state.userUnbanList" :key="account.name">{{account.display_name}}(@{{ account.name }})</router-link>
              </div>
              <el-divider class="my-4" />
              <div class="sticky-title">
                <h3>数据变动</h3>
              </div>
              <el-table v-loading="!state.userData.length" :data="state.userData" :default-sort="{prop: 'followers_add', order: 'descending'}" style="width: 100%">
                <el-table-column label="用户名" prop="display_name"></el-table-column>
                <el-table-column label="关注数" prop="followers" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="关注变化量" prop="followers_add" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="总推文数" prop="statuses_count" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="推文变化量" prop="statuses_count_add" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="监听天数" prop="time" sortable></el-table-column>
                <el-table-column :filter-method="filterTag" :filters="projects" filter-placement="bottom-end" header-align="center" label="组" prop="group">
                  <template #default="scope">
                    <div v-for="group in scope.row.group" :style="{'background-color': state.accountColor.project[group], padding: '5px 11px', 'font-size': '12px', 'color': group === '其他' ? 'black' : 'white'}" class="me-1">
                      {{ group }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-divider class="my-4" />
              <h3 class="sticky-title">标签排行</h3>
              <p class="text-muted">没有任何悬念，这玩意有什么存在的必要吗</p>
              <el-table v-loading="!state.hashTagList.length" :data="state.hashTagList" :default-sort="{prop: 'count', order: 'descending'}" style="width: 100%">
                <el-table-column label="名称" prop="text"></el-table-column>
                <el-table-column label="统计" prop="count" show-overflow-tooltip sortable></el-table-column>
              </el-table>
              <el-divider class="my-4" />
              <h3 class="sticky-title">服务质量</h3>
              <p class="text-muted">例行公事，今年SLA那叫一个崩啊</p>
              <p>使用NodeJS重写的整套服务效率确实提高了很多，但为稳定性也下降了；同时由Twitter被收购以及后续的各种操作导致本身稳定性下降，我们的服务质量也被动下降</p>
              <ul>
                <li><code>10/14 ~ 10/15</code> 这两天爬虫完全挂了然而我们没有发现，导致直接缺了那两天的数据</li>
                <li><code>8/21 ~ 8/22</code> 这两天由于 Twitter 返回了部分损坏了的数据，虽然我们已经察觉到了问题但无法阻止 <router-link to="/tomori_kusunoki/all">tomori_kusunoki</router-link> 和 <router-link to="/t_chiemi1006/all">t_chiemi1006</router-link> 的记录出现损坏的数据，具体情况可以在 <router-link to="/i/topics/lovelive_trends">LoveLive! Trends</router-link> 页面检查当周导出的数据</li>
              </ul>
              <tmv2-chart-without-data-set :chart-rows="state.serverStatusChartMeta.serverStatusTotalTweets"
                          :colors="serverStatusColor.serverStatusTotalTweets" :label-map="serverStatusLabel.totalTweets"
                          chart-type="line" />
              <tmv2-chart-without-data-set :chart-rows="state.serverStatusChartMeta.serverStatusTotalTime"
                          :colors="serverStatusColor.serverStatusTotalTime" :label-map="serverStatusLabel.totalTime"
                          :y-axis="{type: 'log', name: '秒', scale: true}" chart-type="line" />
              <tmv2-chart-without-data-set :chart-rows="state.serverStatusChartMeta.serverStatusTotalSuccessRate"
                          :colors="serverStatusColor.serverStatusTotalSuccessRate"
                          :label-map="serverStatusLabel.successRate" chart-type="line" />
              <tmv2-chart-without-data-set :chart-rows="state.serverStatusChartMeta.serverStatusTotalOnline"
                          :label-map="serverStatusLabel.onlineRate" chart-type="line" :y-axis-index="[0, 1]" :y-axis="[{type: 'value', scale: true, minInterval: 1, min: 0, max: 1}, {type: 'value', scale: true, minInterval: 1, name: 'minutes', min: 0, max: 1440}]" />
              <el-divider class="my-4" />
              <h3 class="sticky-title">独立数据</h3>
              <div id="annual2022bangdream" class="mb-4" v-if="state.accountComputedData.bangdream">
                <h4>BanG Dream!</h4>
                <p class="text-muted">2022-01-01 ~ 2022-12-30 (GMT+9)</p>
                <div class="my-1">
                  <span type="button" @click="swapGroupStatus('bangdream', group)" :class="{'badge': true, 'me-1': true, 'text-white': true}" :style="{'background-color': selected ? state.accountColor.group[group] : '#6c757d'}" v-for="(selected, group) in state.accountListFilter.bangdream" :key="group">{{group}}</span>
                </div>
                <heat-map-chart title="发推热力图（包含发推转推）" :data="state.accountComputedData.bangdream.tweets" year="2022"/>
                <heat-map-chart title="转推热力图" :data="state.accountComputedData.bangdream.retweet" year="2022" class="mb-2"/>
                <div class="row" >
                  <bar-stack-chart title="时间段" :data="{tweet: state.accountComputedData.bangdream.hourCount, media: state.accountComputedData.bangdream.mediaCount}" class="col-12 col-lg-6 mb-2"/>
                  <pie-chart title="发推时间段" :chart-data="state.accountComputedData.bangdream.hourCount" :name-wrapper="(x) => x + '时'" class="col-12 col-lg-6 mb-2"/>
                </div>
                <sun-burst-chart class="mb-2" title="改名部" subtitle="让我看看是谁在改名" :data="state.accountComputedData.bangdream.renameDepartment" />

                <word-cloud-chart :data="state.projectHashtagList.bangdream" title="标签云" subtitle="片假地狱" />

                <bar-race-charts v-if="state.accountComputedData.bangdream.trendsData.followers.length" :data="state.accountComputedData.bangdream.trendsData.followers" :colors="state.accountColor.member" title="关注增量排序" :label-map="state.accountComputedData.bangdream.trendsData.label" />

                <h5 class="fw-bold">关注增量</h5>
                <tmv2-chart-without-data-set class="mb-2" :chart-rows="state.accountComputedData.bangdream.trendsData.followers" :label-map="state.accountComputedData.bangdream.trendsData.label"
                            chart-type="line" chart-height="90vh" :colors="state.accountComputedData.bangdream.trendsData.color" :set-option="{notMerge: true}" :grid="{}" legend-type="" />
                <h5 class="fw-bold">推文增量</h5>
                <tmv2-chart-without-data-set class="mb-2" :chart-rows="state.accountComputedData.bangdream.trendsData.statuses_count" :label-map="state.accountComputedData.bangdream.trendsData.label"
                            chart-type="line" chart-height="90vh" :colors="state.accountComputedData.bangdream.trendsData.color" :set-option="{notMerge: true}" :grid="{}" legend-type="" />
                <div class="row">
                  <pie-chart title="点赞超1万" :chart-data="{'超过1万': state.singleProjectList.bangdream.like.more_than_10k, '不足1万': state.singleProjectList.bangdream.like.less_than_10k}" class="mb-2 col-md-4"/>
                  <pie-chart title="转推率" :chart-data="{'原创': state.singleProjectList.bangdream.count - state.singleProjectList.bangdream.retweet_count, '转推': state.singleProjectList.bangdream.retweet_count}" class="mb-2 col-md-4"/>
                  <pie-chart title="留存率" :chart-data="{'保留': state.singleProjectList.bangdream.count - state.singleProjectList.bangdream.deleted_count, '删除': state.singleProjectList.bangdream.deleted_count}" class="mb-2 col-md-4"/>
                  <div class="col-md-3" v-for="mostType in ['most_retweet', 'most_like', 'most_reply', 'most_quote']" :key="mostType">
                    <p class="fw-bold">{{ mostI18n[mostType] }}</p>
                    <!--<tweet-item :tweet="state.singleProjectTweets.filter(x => x.tweet_id === state.singleProjectList.bangdream.most_retweet[0].tweet_id)[0]" />-->
                    <online-tweet-item :tweet_id="tweetData.tweet_id" class="mb-3" v-for="tweetData in state.singleProjectList.bangdream[mostType]" :key="tweetData.tweet_id" />
                  </div>
                </div>
              </div>
              <div id="annual2022lovelive" class="mb-4" v-if="state.accountComputedData.lovelive">
                <h4>LoveLive!</h4>
                <p class="text-muted">2022-01-01 ~ 2022-12-30 (GMT+9)</p>
                <div class="my-1">
                  <span type="button" @click="swapGroupStatus('lovelive', group)" :class="{'badge': true, 'me-1': true, 'text-white': true}" :style="{'background-color': selected ? state.accountColor.group[group] : '#6c757d'}" v-for="(selected, group) in state.accountListFilter.lovelive" :key="group">{{group}}</span>
                </div>
                <heat-map-chart title="发推热力图（包含发推转推）" :data="state.accountComputedData.lovelive.tweets" year="2022"/>
                <heat-map-chart title="转推热力图" :data="state.accountComputedData.lovelive.retweet" year="2022" class="mb-2"/>
                <div class="row" >
                  <bar-stack-chart title="时间段" :data="{tweet: state.accountComputedData.lovelive.hourCount, media: state.accountComputedData.lovelive.mediaCount}" class="col-12 col-lg-6 mb-2"/>
                  <pie-chart title="发推时间段" :chart-data="state.accountComputedData.lovelive.hourCount" :name-wrapper="(x) => x + '时'" class="col-12 col-lg-6 mb-2"/>
                </div>
                <sun-burst-chart class="mb-2" title="改名部" subtitle="让我看看是谁在改名" :data="state.accountComputedData.lovelive.renameDepartment" />

                <word-cloud-chart :data="state.projectHashtagList.lovelive" title="标签云" subtitle="片假地狱" />

                <bar-race-charts v-if="state.accountComputedData.lovelive.trendsData.followers.length" :data="state.accountComputedData.lovelive.trendsData.followers" :colors="state.accountColor.member" title="关注增量排序" :label-map="state.accountComputedData.lovelive.trendsData.label" />

                <h5 class="fw-bold">关注增量</h5>
                <tmv2-chart-without-data-set class="mb-2" :chart-rows="state.accountComputedData.lovelive.trendsData.followers" :label-map="state.accountComputedData.lovelive.trendsData.label"
                                             chart-type="line" chart-height="90vh" :colors="state.accountComputedData.lovelive.trendsData.color" :set-option="{notMerge: true}" :grid="{}" legend-type="" />
                <h5 class="fw-bold">推文增量</h5>
                <tmv2-chart-without-data-set class="mb-2" :chart-rows="state.accountComputedData.lovelive.trendsData.statuses_count" :label-map="state.accountComputedData.lovelive.trendsData.label"
                                             chart-type="line" chart-height="90vh" :colors="state.accountComputedData.lovelive.trendsData.color" :set-option="{notMerge: true}" :grid="{}" legend-type="" />
                <div class="row">
                  <pie-chart title="点赞超1万" :chart-data="{'超过1万': state.singleProjectList.lovelive.like.more_than_10k, '不足1万': state.singleProjectList.lovelive.like.less_than_10k}" class="mb-2 col-md-4"/>
                  <pie-chart title="转推率" :chart-data="{'原创': state.singleProjectList.lovelive.count - state.singleProjectList.lovelive.retweet_count, '转推': state.singleProjectList.lovelive.retweet_count}" class="mb-2 col-md-4"/>
                  <pie-chart title="留存率" :chart-data="{'保留': state.singleProjectList.lovelive.count - state.singleProjectList.lovelive.deleted_count, '删除': state.singleProjectList.lovelive.deleted_count}" class="mb-2 col-md-4"/>
                  <div class="col-md-3" v-for="mostType in ['most_retweet', 'most_like', 'most_reply', 'most_quote']" :key="mostType">
                    <p class="fw-bold">{{ mostI18n[mostType] }}</p>
                    <!--<tweet-item :tweet="state.singleProjectTweets.filter(x => x.tweet_id === state.singleProjectList.lovelive.most_retweet[0].tweet_id)[0]" />-->
                    <online-tweet-item :tweet_id="tweetData.tweet_id" class="mb-3" v-for="tweetData in state.singleProjectList.lovelive[mostType]" :key="tweetData.tweet_id" />
                  </div>
                </div>
                <h5>备注</h5>
                <ul>
                  <li>与2021年度总结不一样，2022年把本年新增的人员也加进来了，虽然默认是0关注0发推起步，但跟实际情况还是有点出入的</li>
                  <li>由于A-RISE的成员基本都远离本企划了，所以多数图表都不统计此团体（2022年中疑似有一位成员新开了一个帐号但在几天后迅速锁推删号，我们虽然爬取了部分数据但不考虑放出数据）</li>
                </ul>
              </div>
              <div id="annual2022official" class="mb-4" >
                <h4>官推</h4>
                <p class="text-muted">包括 Love Live! 和 BanG Dream!</p>
                <div class="my-1">
                  <span type="button" @click="swapGroupStatus('official', group)" :class="{'badge': true, 'me-1': true, 'text-white': true}" :style="{'background-color': selected ?( group === 'BanGDream!' ? '#E4003DD9' : '#1DA1F2FF') : '#6c757d'}" v-for="(selected, group) in state.accountListFilter.official" :key="group">{{group}}</span>
                </div>
                <heat-map-chart title="发推热力图（包含发推转推）" :data="state.accountComputedData.official.tweets" year="2022"/>
                <heat-map-chart title="转推热力图" :data="state.accountComputedData.official.retweet" year="2022" class="mb-2"/>
                <div class="row" >
                  <bar-stack-chart title="时间段" :data="{tweet: state.accountComputedData.official.hourCount, media: state.accountComputedData.official.mediaCount}" class="col-12 col-lg-6 mb-2"/>
                  <pie-chart title="发推时间段" :chart-data="state.accountComputedData.official.hourCount" class="col-12 col-lg-6 mb-2" :name-wrapper="(x) => x + '时'"/>
                </div>
                <sun-burst-chart class="mb-2" title="改名部" subtitle="让我看看是谁在改名" :data="state.accountComputedData.official.renameDepartment" />
                <h5 class="fw-bold">关注增量</h5>
                <tmv2-chart-without-data-set class="mb-2" :chart-rows="state.accountComputedData.official.trendsData.followers" :label-map="state.accountComputedData.official.trendsData.label"
                            chart-type="line" chart-height="600px" :set-option="{notMerge: true}" legend-type="" />
                <h5 class="fw-bold">推文增量</h5>
                <tmv2-chart-without-data-set class="mb-2" :chart-rows="state.accountComputedData.official.trendsData.statuses_count" :label-map="state.accountComputedData.official.trendsData.label"
                            chart-type="line" chart-height="600px" :set-option="{notMerge: true}" legend-type="" />
              </div>
              <h3 class="sticky-title">一些别的话</h3>
              <p class="text-muted">前面说了一大堆，这里是我的吐槽</p>
              <ul>
                <li>摆烂摸鱼导致最后一天才开始处理数据，还好今年的页面基本沿用了去年的套路所以不需要写什么东西（结果还是漏爬了一部分的推文，不过懒得管了）</li>
                <li>总之，希望明年还能继续在这里见面，如果2023年我们还能坚持下去年度总结将会增加 22/7 以及 D4DJ 的版块</li>
                <li>一年过去了哔哩哔哩专栏还是一点原创内容就会标禁止转载，为什么原创就必须禁止转载？</li>
                <li>今年启发我做每周数据追踪的up主消失了，我们也不好随便猜测对方为什么不继续，但我始终认为 Twitter Monitor 这种自动导出数据的做法还是挺无聊的，毕竟缺少对过去发生的事情的解说</li>
                <li>为什么不分开做每个企划的表格？因为有更详细的每周报告：<router-link to="/i/topics/bangdream_trends/">BanGDream!</router-link> 和 <router-link to="/i/topics/lovelive_trends/">LoveLive!</router-link></li>
                <li>官号的图表也有<router-link to="/i/topics/staff_data_page/">更详细的版本</router-link>，这里只是顺手做的</li>
              </ul>
              <h3>数据</h3>
              <p>本页内容，下列数据以及我们发布在哔哩哔哩专栏的内容均在 <a href="https://creativecommons.org/licenses/by-sa/4.0/legalcode.zh-Hans" target="_blank">署名—相同方式共享 4.0 协议国际版</a> 之条款下提供</p>
              <ul>
                <li><a :href="store.getters.getBasePath + '/static/db/annual2022.json'" target="_blank">本页数据</a></li>
                <li><a :href="store.getters.getBasePath + '/static/db/2022_tweets_meta.json'" target="_blank">2022年推文数据</a></li>
              </ul>
            </div>
          </div>
        </div>
        <p class="lead text-center mb-4">Project Twitter Monitor</p>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import SinglePageHeader from "../../components/SinglePageHeader.vue";
import {onMounted, reactive, ref, Ref, watch} from "vue";
import {useHead} from "@vueuse/head";
import Tmv2ChartWithoutDataSet from "../../components/Charts/Tmv2ChartWithoutDataSet.vue";
import {ApiAnnual2022} from "../../types/Api";
import WordCloudChart from "../../components/Charts/WordCloudChart.vue";
import {Annual2021DataTemplate, Annual2021Template, Annual2021TmpDataTemplate} from "../../types/Content";
import {cloneDeep} from "lodash-es";
import HeatMapChart from "../../components/Charts/HeatMapChart.vue";
import BarStackChart from "../../components/Charts/BarStackChart.vue";
import PieChart from "../../components/modules/pieChart.vue";
import SunBurstChart from "../../components/Charts/SunBurstChart.vue";
import BarRaceCharts from "../../components/Charts/BarRaceCharts.vue";
import {useStore} from "../../store";
import {Notice, ScrollTo} from "../../share/Tools";
import OnlineTweetItem from "../../components/OnlineTweetItem.vue";

useHead({
  title: '2022统计',
  meta: [{
    name: "theme-color",
    content: "#1da1f2"
  }]
})

const mostI18n = {
  most_retweet: '最多转推',
  most_like: '最多点赞',
  most_quote: '最多引用',
  most_reply: '最多回复',
}

const projects = [{"text": "BanGDream!", "value": "BanGDream!"}, {"text": "ARGONAVIS", "value": "ARGONAVIS"}, {"text": "LoveLive!", "value": "LoveLive!"}, {"text": "D4DJ", "value": "D4DJ"}, {"text": "227", "value": "227"}, {"text": "其他", "value": "其他"}]

const serverStatusLabel = {
  totalTweets: {"date": "日期", "total_tweets": "每日处理推文数", "tweets_count": "总处理推文数", "avg_tweets": "平均每次处理条数"},
  totalTime: {"date": "日期", "total_time_cost": "总耗时", "max_time_cost": "最大耗时", "min_time_cost": "最小耗时", "avg_time_cost": "平均耗时",},
  successRate: {"date": "日期", "success_rate": "成功率",},
  onlineRate: {"date": "日期", "online_rate": "在线率", "down_time_count": "离线时长"}
}
const serverStatusColor = {serverStatusTotalTweets: ['#19d4ae', '#d87a80', '#5ab1ef'], serverStatusTotalTime: ['#5ab1ef', '#fa6e86', '#ffb980', '#c4b4e4'], serverStatusTotalSuccessRate: ['#0067a6'],}

const store = useStore()

const state = reactive<{
  accountListFilter: Ref<{[p in string]: {[q in string]: boolean}}>
  loading: Ref<boolean>
  progress: Ref<number>
  userAddList: ApiAnnual2022["user_add_list"]
  userRenameList: ApiAnnual2022["user_rename_list"]
  userUnbanList: ApiAnnual2022["user_unban_list"]
  hashTagList: ApiAnnual2022["hashtag_rank"]
  userData: ApiAnnual2022["user_data"]
  serverStatusMeta: ApiAnnual2022["server_status_meta"]
  accountData: Ref<ApiAnnual2022["account_data"]>
  accountColor: ApiAnnual2022["account_color"]
  accountComputedData: { [p in 'bangdream' | 'lovelive' | 'official']: Annual2021DataTemplate } | {}
  projectHashtagList: ApiAnnual2022["single_project_hashtag"]
  displayNameList: ApiAnnual2022["display_name_list"]
  singleProjectList: ApiAnnual2022["single_project_list"]
  singleProjectTweets: ApiAnnual2022["single_project_tweets"]
  serverStatusChartMeta: {
    serverStatusTotalTweets: { date: string; total_tweets: number; tweets_count: number; avg_tweets: number; }[]
    serverStatusTotalTime: { date: string; total_time_cost: number; max_time_cost: number; min_time_cost: number; avg_time_cost: number; }[]
    serverStatusTotalSuccessRate: { date: string; success_rate: number }[]
    serverStatusTotalOnline: { date: string; online_rate: number; down_time_count: number }[]
  }
  renderFlag: ReturnType<typeof setTimeout>
  accountDataCache: Map<string, Annual2021TmpDataTemplate>
  groupDataCache: Map<string, Annual2021Template<{[p in string]: number}, {[p: string]: { [q: string]: string | number }}>>
}>({
  accountListFilter: ref({
    bangdream: {"Poppin'Party": true, "Afterglow": true, "Pastel*Palettes": true, "Roselia":  true, "Hello, Happy World!": true, "Morfonica": true, "RAISE A SUILEN": true,},
    lovelive: {"μ's": true, "Aqours": true, "Saint Snow":  true, "虹ヶ咲学園": true, "Liella!": true,},
    official: {"BanGDream!": true, "LoveLive!": true}
  }),
  loading: ref(true),
  progress: ref(0),
  userAddList: [],
  userRenameList: [],
  userUnbanList: [],
  hashTagList: [],
  userData: [],
  serverStatusMeta: [],
  accountData: ref([]),
  accountColor: {},
  accountComputedData: {},
  projectHashtagList: {},
  singleProjectList: {},
  singleProjectTweets: [],
  displayNameList: {},
  serverStatusChartMeta: {serverStatusTotalTweets: [], serverStatusTotalTime: [], serverStatusTotalSuccessRate: [], serverStatusTotalOnline: [],},
  renderFlag: setTimeout(() => {}, 0),
  accountDataCache: new Map(),
  groupDataCache: new Map(),
})

const filterTag = (value: string, row: any) => {
  return row.group.includes(value)
}


const tmpDataTemplateGenerator = <U, V>(defaultU: U, defaultV: V): Annual2021Template<U, V> => ({
  tweets: cloneDeep(defaultU),
  retweet: cloneDeep(defaultU),
  hourCount: new Array(24).fill(0),
  mediaCount: new Array(24).fill(0),
  renameDepartment: {},
  trendsData: {
    label: {date: '日期'},
    color: [],
    followers: cloneDeep(defaultV),
    statuses_count: cloneDeep(defaultV),
  }
})

const tmpDataTemplate = (): Annual2021DataTemplate => ({
  tweets: [],
  retweet: [],
  hourCount: new Array(24).fill(0),
  mediaCount: new Array(24).fill(0),
  renameDepartment: {},
  trendsData: {
    label: {date: '日期'},
    color: [],
    followers: [],
    statuses_count: [],
  }
})

const tmpUserDataTemplate = (): Annual2021TmpDataTemplate => ({
  tweets: {},
  retweet: {},
  hourCount: new Array(24).fill(0),
  mediaCount: new Array(24).fill(0),
  renameDepartment: {},
  trendsData: {
    label: {date: '日期'},
    color: [],
    followers: {},
    statuses_count: {},
  }
})

const swapGroupStatus = (project: string, group: string) => {
  state.accountListFilter[project][group] = !state.accountListFilter[project][group]
}

const init = (bytesReceived: number, chunks: ArrayLike<number>[]) => {
  let chunksAll = new Uint8Array(bytesReceived);
  let position = 0;
  for(let chunk of chunks) {
    chunksAll.set(chunk, position);
    position += chunk.length;
  }
  let data: ApiAnnual2022 = JSON.parse(new TextDecoder("utf-8").decode(chunksAll))
  state.displayNameList = data.display_name_list
  state.userAddList = data.user_add_list
  state.userRenameList = data.user_rename_list
  state.userUnbanList = data.user_unban_list
  state.hashTagList = data.hashtag_rank
  state.userData = data.user_data
  state.serverStatusMeta = data.server_status_meta
  state.accountData = data.account_data
  state.accountColor = data.account_color
  state.projectHashtagList = data.single_project_hashtag
  state.singleProjectList = data.single_project_list
  state.singleProjectTweets = data.single_project_tweets
  setupCharts()
  generateData(true)
  ScrollTo()
}

let latestAccountListFilter: {[p in string]: {[q in string]: boolean}} = {}
const tmpProjectGenerate = (projectName: string, organization: boolean): 'official' | 'bangdream' | 'lovelive' =>  organization ? 'official': (projectName === 'BanGDream!' ? 'bangdream' : 'lovelive')

const generateData = (firstGenerate: boolean = false) => {
  //TODO fix type {[p in 'bangdream' | 'lovelive' | 'official']: dataTemplate}
  let tmpData: any = Object.values(state.accountComputedData).length === 0 ? {
    bangdream: tmpDataTemplate(),
    lovelive: tmpDataTemplate(),
    official: tmpDataTemplate()
  } : cloneDeep(state.accountComputedData)
  //pre check
  let tmpUpdateList = new Set()
  for (let projectName of ['bangdream', 'lovelive', 'official']) {
    if (latestAccountListFilter[projectName]) {
      let tmp = Object.values(latestAccountListFilter[projectName])
      let tmpOriginal = Object.values(state.accountListFilter[projectName])
      for (let valueIndex in tmp) {
        if (tmp[valueIndex] !== tmpOriginal[valueIndex]) {
          tmpUpdateList.add(projectName)
          tmpData[projectName] = tmpDataTemplate()
          break
        }
      }
    } else if (!latestAccountListFilter[projectName]) {
      tmpUpdateList.add(projectName)
    }
  }
  for (let account of state.accountData) {
    //break
    let breakRender = false
    for (let projectMeta of account.projects) {
      if (projectMeta[0] === 'D4DJ') {
        continue
      }
      let tmpProject = tmpProjectGenerate(projectMeta[0], account.organization)
      if (!tmpUpdateList.has(tmpProject) || (!account.organization && !state.accountListFilter[tmpProject][projectMeta[1]]) || (account.organization && !state.accountListFilter[tmpProject][projectMeta[0]])) {
        breakRender = true
        break
      }
    }
    if (breakRender) {
      continue
    }
    //console.log(account)
    let tmpPersonData = tmpUserDataTemplate()
    if (!firstGenerate) {
      let tmpCache = state.accountDataCache.get(account.name)
      if (typeof tmpCache === 'undefined') {continue}
      tmpPersonData = tmpCache
    } else {
      //每日数据
      for (let date in account.daily_data) {
        let tmpDate = date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8)
        let tmpDailyTweetCount = account.daily_data[date].hour_count.length === 0 ? 0 : account.daily_data[date].hour_count.reduce((acr, cur) => acr + cur)
        let tmpRetweetCount = typeof(account.daily_data[date].original) === 'undefined' ? 0 : tmpDailyTweetCount - (account.daily_data[date].original)
        tmpPersonData.tweets[tmpDate] ? tmpPersonData.tweets[tmpDate] += tmpDailyTweetCount : tmpPersonData.tweets[tmpDate] = tmpDailyTweetCount
        tmpPersonData.retweet[tmpDate] ? tmpPersonData.retweet[tmpDate] += tmpRetweetCount : tmpPersonData.retweet[tmpDate] = tmpRetweetCount
        account.daily_data[date].hour_count.forEach((count, time) => {
          tmpPersonData.hourCount[time] += count
        })
        account.daily_data[date].media.forEach((count, time) => {
          tmpPersonData.mediaCount[time] += count
        })
        //三大件
        if ((account.name !== 'shikaco_staff')) {
          tmpPersonData.trendsData.followers[tmpDate] = account.daily_data[date].followers ? account.daily_data[date].followers : 0
          tmpPersonData.trendsData.statuses_count[tmpDate] = account.daily_data[date].statuses_count ? account.daily_data[date].statuses_count : 0
          //following: account.daily_data[date].following ? account.daily_data[date].following : NaN,
          //statuses_count: account.daily_data[date].statuses_count ? account.daily_data[date].statuses_count : NaN,
          //name: account.name,
        }
      }
      //tmpPersonData.tweets = Object.keys(tmpPersonData.tweets).map(day => [day, tmpPersonData.tweets[day]])
      //tmpPersonData.retweet = Object.keys(tmpPersonData.retweet).map(day => [day, tmpPersonData.retweet[day]])
      state.accountDataCache.set(account.name, tmpPersonData)
    }
    account.projects.forEach(projectMeta => {
      if (projectMeta[0] === 'LoveLive!' && (account.name === 'sakuragawa_megu' || account.name === 'shikaco_staff')) {
        return
      }
      let tmpProject = tmpProjectGenerate(projectMeta[0], account.organization)
      //console.log(new Date(), tmpProject)
      //break
      if ((!account.organization && !state.accountListFilter[tmpProject][projectMeta[1]]) || (account.organization && !state.accountListFilter[tmpProject][projectMeta[0]])) {
        return
      }
      let group = account.organization ? projectMeta[0] : projectMeta[1]
      //label
      tmpData[tmpProject].trendsData.label[account.name] = state.displayNameList[account.name]
      tmpData[tmpProject].trendsData.color.push(state.accountColor.member[account.name])
      // 仅在首次处理时使用
      if (firstGenerate) {
        let tmpGroupData = tmpDataTemplateGenerator<{[p in string]: number}, {[p: string]: { [q: string]: string | number }}>({}, {})
        if (state.groupDataCache.has(group)) {
          let tmpGroupCache = state.groupDataCache.get(group)
          if (typeof tmpGroupCache === 'undefined') {return}
          tmpGroupData = tmpGroupCache
        }
        //合并数据
        for (const date in tmpPersonData.tweets) {
          if (tmpGroupData.tweets[date]) {
            tmpGroupData.tweets[date] += tmpPersonData.tweets[date]
          } else {
            tmpGroupData.tweets[date] = tmpPersonData.tweets[date]
          }
        }
        for (const date in tmpPersonData.retweet) {
          if (tmpGroupData.retweet[date]) {
            tmpGroupData.retweet[date] += tmpPersonData.retweet[date]
          } else {
            tmpGroupData.retweet[date] = tmpPersonData.retweet[date]
          }
        }
        for (let time in tmpPersonData.hourCount) {
          tmpGroupData.hourCount[time] += tmpPersonData.hourCount[time]
        }
        for (let time in tmpPersonData.mediaCount) {
          tmpGroupData.mediaCount[time] += tmpPersonData.mediaCount[time]
        }
        //if ((account.name !== 'homoto_akina') && (account.name !== 'uchida_shu0524')) {
          let baseFollowers: number | string = tmpPersonData.trendsData.followers["2022-01-01"] || 0//only bangdream
          Object.keys(tmpPersonData.trendsData.followers).forEach(date => {
            if (['2022-08-21', '2022-08-22'].includes(date) && ['tomori_kusunoki', 't_chiemi1006'].includes(account.name)){return}
            if (!tmpGroupData.trendsData.followers[date]) {
              tmpGroupData.trendsData.followers[date] = {}
            }
            tmpGroupData.trendsData.followers[date][account.name] = Number(tmpPersonData.trendsData.followers[date]) - Number(baseFollowers)// (tmpProject === 'bangdream' ? baseFollowers : 0)
          })

          let baseStatusesCount: number | string = tmpPersonData.trendsData.statuses_count["2022-01-01"] || 0//only bangdream
          Object.keys(tmpPersonData.trendsData.statuses_count).forEach(date => {
            if (!tmpGroupData.trendsData.statuses_count[date]) {
              tmpGroupData.trendsData.statuses_count[date] = {}
            }
            tmpGroupData.trendsData.statuses_count[date][account.name] = Number(tmpPersonData.trendsData.statuses_count[date]) - Number(baseStatusesCount)// (tmpProject === 'bangdream' ? baseStatusesCount : 0)
          })
        //}
        // 改名部
        let tmpChildren = {
          name: account.name,
          itemStyle: {color: state.accountColor.member[account.name]},
          children: account.display_name_list.map(name => ({
            name,
            itemStyle: {color: state.accountColor.member[account.name]},
            value: 1,
          }))}
        if(tmpGroupData.renameDepartment[projectMeta[Number(!account.organization)]]) {
          tmpGroupData.renameDepartment[projectMeta[Number(!account.organization)]].push(tmpChildren)
        } else {
          tmpGroupData.renameDepartment[projectMeta[Number(!account.organization)]] = [tmpChildren]
        }
        state.groupDataCache.set(group, tmpGroupData)
      }
    })
  }
  //console.log(state.groupDataCache)
  for (let projectName of ['bangdream', 'lovelive', 'official']) {
    if (!tmpUpdateList.has(projectName) || tmpData[projectName] === undefined) {
      continue
    }
    // merge data from group cache
    for(let group of Object.keys(state.accountListFilter[projectName]).filter(groupName => state.accountListFilter[projectName][groupName])) {
      const tmpGroupData = state.groupDataCache.get(group)
      if (typeof tmpGroupData === 'undefined') {
        continue
      }
      // merge tweets and retweet
      Object.keys(tmpGroupData.tweets).forEach(date => {
        tmpData[projectName].tweets[date] ? tmpData[projectName].tweets[date] += tmpGroupData.tweets[date] : tmpData[projectName].tweets[date] = tmpGroupData.tweets[date]
      })
      Object.keys(tmpGroupData.retweet).forEach(date => {
        tmpData[projectName].retweet[date] ? tmpData[projectName].retweet[date] += tmpGroupData.retweet[date] : tmpData[projectName].retweet[date] = tmpGroupData.retweet[date]
      })
      // hour count
      for (let time in tmpGroupData.hourCount) {
        tmpData[projectName].hourCount[time] += tmpGroupData.hourCount[time]
      }
      for (let time in tmpGroupData.mediaCount) {
        tmpData[projectName].mediaCount[time] += tmpGroupData.mediaCount[time]
      }
      // trends
      Object.keys(tmpGroupData.trendsData.followers).forEach(date => {
        if (!tmpData[projectName].trendsData.followers[date]) {
          tmpData[projectName].trendsData.followers[date] = {date}
        }
        tmpData[projectName].trendsData.followers[date] = {...tmpData[projectName].trendsData.followers[date], ...tmpGroupData.trendsData.followers[date]}
      })
      Object.keys(tmpGroupData.trendsData.statuses_count).forEach(date => {
        if (!tmpData[projectName].trendsData.statuses_count[date]) {
          tmpData[projectName].trendsData.statuses_count[date] = {date}
        }
        tmpData[projectName].trendsData.statuses_count[date] = {...tmpData[projectName].trendsData.statuses_count[date], ...tmpGroupData.trendsData.statuses_count[date]}
      })
      // rename
      tmpData[projectName].renameDepartment = {...tmpData[projectName].renameDepartment, ...tmpGroupData.renameDepartment}
    }
    //改名部
    tmpData[projectName].renameDepartment = (Object.keys(tmpData[projectName].renameDepartment).map(groupName => ({
      name: groupName,
      itemStyle: {color: state.accountColor.group[groupName]},//.85不错
      children: tmpData[projectName].renameDepartment[groupName]
    })))
    //三大件
    tmpData[projectName].trendsData.followers = Object.values(tmpData[projectName].trendsData.followers)
    tmpData[projectName].trendsData.statuses_count = Object.values(tmpData[projectName].trendsData.statuses_count)
    //热力图
    tmpData[projectName].tweets = Object.keys(tmpData[projectName].tweets).map(date => [date, tmpData[projectName].tweets[date]])
    tmpData[projectName].retweet = Object.keys(tmpData[projectName].retweet).map(date => [date, tmpData[projectName].retweet[date]])
  }
  //tmpData.hourCount = tmpData.hourCount.map((count, time) => ({name: time + '时', value: count}))
  //tmpData.mediaCount = tmpData.mediaCount.map((count, time) => ({name: time + '时', value: count}))
  latestAccountListFilter = cloneDeep(state.accountListFilter)
  state.accountComputedData = tmpData
  //console.log(tmpData)
  state.loading = false
}
const renderAll = () => {
  clearTimeout(state.renderFlag)
  state.renderFlag = setTimeout(generateData, 0)
}

const setupCharts = () => {
  state.serverStatusMeta.map(x => {
    if (x.total_time_cost !== 0) {
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
    }
    state.serverStatusChartMeta.serverStatusTotalOnline.push({
      date: x.date,
      online_rate: x.online_rate,
      down_time_count: (1 - x.online_rate) * 1440
    })
  })
}

onMounted(() => {
  fetch(store.getters.getBasePath + "/static/db/annual2022.json").then((response: Response) => {
    if (!response.body) {return}
    let reader = response.body.getReader()
    let bytesReceived = 0
    let chunks: ArrayLike<number>[] = []
    reader.read().then(async function processResult(result): Promise<any> {
      if (result.done) {
        init(bytesReceived, chunks)
        return
      }
      chunks.push(result.value)
      bytesReceived += result.value.length
      state.progress = Math.floor((bytesReceived / 5655954) * 100)//不要想太多, 这个数字只是文件大小已知而已
      return reader.read().then(processResult)
    })
  }).catch(e => {
    Notice(e.toString(), 'error')
  })
})

watch(() => state.accountListFilter, () => {renderAll()}, {deep: true})


</script>

<style scoped lang="scss">
a.badge {
  color: white;
}
.sticky-title {
  position: sticky;
  margin: 0.2em -0.5em;
  padding: 0.2em 0.5em;
  top: -1px;
  background-color: white;
  z-index: 1999;
  display: flex;
  justify-content: space-between;
}
</style>
