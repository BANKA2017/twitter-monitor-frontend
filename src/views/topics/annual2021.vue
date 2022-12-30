<template>
  <div id="annual2021">
    <el-collapse-transition >
      <div v-if="loading" style="background-color: #1da1f2; min-height: 100vh" class="text-center">
        <p class="text-white" style="font-size: 14vh; padding: 20vh 0 0 0;">Twitter Monitor</p>
        <p class="text-white" style="font-size: 8vh;">2021</p>
        <div class="progress" style="height: 5px; max-width: 50vw; margin: auto">
          <div class="progress-bar" role="progressbar" id="progress" :style="{'width': progress + '%', 'background-color': '#1da1f2'}" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
      <div v-else >
        <single-page-header title="Twitter Monitor" sub-title="2021 年度报告" />

        <div class="container">
          <div class="row">
            <div class="col-12">
              <p class="text-muted">
                <small>* 如无特殊注明，统计所使用的时区为东九区(GMT+9)</small><br>
                <small>* 建议使用宽屏并缩放到<code class="fw-bold">90%</code>浏览，否则可能会出现图表显示不全</small><br>
                <small>* 本页对设备性能要求较高，使用性能不足的设备浏览可能会在处理数据时有卡顿感，处理完成后即可正常浏览</small>
              </p>
              <h3>前言</h3>
              <p class="text-muted">在平淡无奇的日子里又过了一年</p>
              <ul class="ms-3">
                <li>升级了前端 Vue 版本(Vue2 -> Vue3)，至少能用了，并释出了<a href="https://github.com/BANKA2017/tmv2-frontend" target="_blank">源码</a>，至此，任何人都能够构建一个不完整但核心功能完全可用的Twitter Monitor</li>
                <li>重构了爬虫，提高了效率</li>
                <li>搬了个家，迁移到了位于法国的 <code>KS-LE</code></li>
              </ul>
              <h3>总概</h3>
              <p class="text-muted">让我康康</p>
              <p>2021年我们没在站内删过账号，今年净增加了{{ userAddList.length }}个账号，包括2名虹团新的正式成员，227企划的一部分账号以及2位重量级人士；虽然站内没删过号，但今年消失了几个账号包括一位前总统，以及几位从227跑路的成员（队长跑路早，根本没来得及加进来）</p>
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
                        <td>
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
                  <p class="text-muted text-center">消失账号 (<span class="text-danger">{{ userDeleteList.length }}</span>)</p>
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
                      <td><router-link :to="`/` + userInfo.name + `/all`" class="text-decoration-none text-dark">
                        @{{ userInfo.name }}
                      </router-link></td>
                    </tr>
                    </tbody>
                  </table>
                  <p class="mt-2">这227跑路的还挺多啊……</p>
                </div>
              </div>
              <el-divider class="my-4" />
              <h3 class="my-3">数据变动</h3>
              <el-table v-loading="!userData.length" :data="userData" :default-sort="{prop: 'followers_add', order: 'descending'}" style="width: 100%">
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
              <el-divider class="my-4" />
              <h3>标签排行</h3>
              <p class="text-muted">没有任何悬念，这玩意有什么存在的必要吗</p>
              <el-table v-loading="!hashTagList.length" :data="hashTagList" :default-sort="{prop: 'count', order: 'descending'}" style="width: 100%">
                <el-table-column label="名称" prop="text"></el-table-column>
                <el-table-column label="统计" prop="count" show-overflow-tooltip sortable></el-table-column>
              </el-table>
              <el-divider class="my-4" />
              <h3>质量</h3>
              <p class="text-muted">例行公事，去年玩过了今年就不再重复介绍了</p>
              <p>我们优化了整个流程，使用异步获取图片的<a href="https://blurha.sh/" target="_blank">blurhash</a>，使绝大多数的爬取都能压缩到<code>20s</code>左右（注意 <code>08-14</code> 的那个下折）</p>
              <ul>
                <li>最严重的是一次配置错误导致直接自动跳过所有任务（检查账号信息除外，所以我们还是正常记录下了所有关注数、发推数变化），由于错误推送系统并未恢复（*注：即使后来恢复了此事仍不会推送，因为推送系统运作的前提是代码可运行），我们无从得知问题的出现，直到数天后进行的例行检查中修复（2021-11-02 ~ 2021-11-14）</li>
                <li>次之的是5月12日的那次强制启用 GraphQL api 事件导致在线率到了<code><abbr title="0.4898">50%</abbr></code>以下，关于这件事，我写了<a href="https://blog.nest.moe/posts/how-to-crawl-twitter-with-graphql" target="_blank">一篇文章</a>作为记录</li>
              </ul>
              <tmv2-chart :chart-rows="serverStatusChartMeta.serverStatusTotalTweets"
                          :colors="serverStatusColor.serverStatusTotalTweets" :label-map="serverStatusLabel.totalTweets"
                          chart-type="line"></tmv2-chart>
              <tmv2-chart :chart-rows="serverStatusChartMeta.serverStatusTotalTime"
                          :colors="serverStatusColor.serverStatusTotalTime" :label-map="serverStatusLabel.totalTime"
                          :y-axis="{type: 'log', name: '秒', scale: true}" chart-type="line"></tmv2-chart>
              <tmv2-chart :chart-rows="serverStatusChartMeta.serverStatusTotalSuccessRate"
                          :colors="serverStatusColor.serverStatusTotalSuccessRate"
                          :label-map="serverStatusLabel.successRate" chart-type="line"></tmv2-chart>
              <tmv2-chart :chart-rows="serverStatusChartMeta.serverStatusTotalOnline"
                          :label-map="serverStatusLabel.onlineRate" chart-type="line" :y-axis-index="[0, 1]" :y-axis="[{type: 'value', scale: true, minInterval: 1}, {type: 'value', scale: true, minInterval: 1}]"></tmv2-chart>
              <el-divider class="my-4" />
              <h3>独立数据</h3>
              <p class="text-muted">川普篇和马斯克篇待定</p>
              <!--<h4>川普 <small class="text-muted">@realdonaldtrump</small> </h4>
              <p class="text-muted">一上来就是重量级人物啊（笑）</p>
              <p>Twitter Monitor 因川普而生（请仔细阅读<router-link to="/about">关于页面</router-link>的内容），年初大选期间 Twitter Monitor 终究还是下手爬川普的 Twitter，虽然没过几天他的号就没了，遗留下来的东西也不知有什么用，毕竟有比 Twitter Monitor 更早干这玩意的<a href="https://www.thetrumparchive.com/" target="_blank">有心人士</a>记录得更完整，既然没什么好说的，我们来看看2021年短短几天里面川普的词云罢</p>
              <div class="my-4" ></div>
              <h4>马斯克 <small class="text-muted">@elonmusk</small> </h4>
              <p class="text-muted">今年不对劲，这不是我熟悉的 Twitter Monitor（再笑）</p>
              <p>众所周知，在年初的各种币乱涨的时候，马斯克可是拱火先锋，尤其是在带头收割 <a href="https://dogecoin.com/" target="_blank">$DOGE</a> ，我们尝试画出了此人发推与 $DOGE 币价的关系</p>
              <div class="my-4" ></div>-->
              <div id="annual2021bangdream" class="mb-4">
                <h4>BanG Dream!</h4>
                <p class="text-muted">2021-01-01 ~ 2021-12-30 (GMT+9)</p>
                <div class="my-1">
                  <span type="button" @click="swapGroupStatus('bangdream', group)" :class="{'badge': true, 'me-1': true, 'text-white': true}" :style="{'background-color': selected ? accountColor.group[group] : '#6c757d'}" v-for="(selected, group) in accountListFilter.bangdream" :key="group">{{group}}</span>
                </div>
                <heat-map-chart title="发推热力图（包含发推转推）" :data="accountComputedData.bangdream.tweets" year="2021"/>
                <heat-map-chart title="转推热力图" :data="accountComputedData.bangdream.retweet" year="2021" class="mb-2"/>
                <div class="row" >
                  <bar-stack-chart-for-annual2021 title="时间段" :data="{tweet: accountComputedData.bangdream.hourCount, media: accountComputedData.bangdream.mediaCount}" class="col-12 col-lg-6 mb-2"/>
                  <pie-chart title="发推时间段" :chart-data="accountComputedData.bangdream.hourCount" class="col-12 col-lg-6 mb-2"/>
                </div>
                <sun-burst-chart-for-annual2021 class="mb-2" title="改名部" subtitle="让我看看是谁在改名" :data="accountComputedData.bangdream.renameDepartment" />

                <word-cloud-chart-for-annual2021 :data="projectHashtagList.bangdream" title="标签云" subtitle="片假地狱" />

                <bar-race-for-annual2021 v-if="accountComputedData.bangdream.trendsData.followers.length" :data="accountComputedData.bangdream.trendsData.followers" :colors="accountColor.member" title="关注增量排序" :label-map="accountComputedData.bangdream.trendsData.label" />

                <tmv2-chart class="mb-2" :chart-rows="accountComputedData.bangdream.trendsData.followers" :label-map="accountComputedData.bangdream.trendsData.label"
                            chart-type="line" chart-height="600px" :colors="accountComputedData.bangdream.trendsData.color" :set-option="{notMerge: true}" title="关注增量"></tmv2-chart>
                <tmv2-chart class="mb-2" :chart-rows="accountComputedData.bangdream.trendsData.statuses_count" :label-map="accountComputedData.bangdream.trendsData.label"
                            chart-type="line" chart-height="600px" :colors="accountComputedData.bangdream.trendsData.color" :set-option="{notMerge: true}" title="推文增量"></tmv2-chart>
              </div>
              <div id="annual2021lovelive" class="mb-4" >
                <h4>Love Live!</h4>
                <p class="text-muted">2021-01-01 ~ 2021-12-30 (GMT+9)</p>
                <div class="my-1">
                  <span type="button" @click="swapGroupStatus('lovelive', group)" :class="{'badge': true, 'me-1': true, 'text-white': true}" :style="{'background-color': selected ? accountColor.group[group] : '#6c757d'}" v-for="(selected, group) in accountListFilter.lovelive" :key="group">{{group}}</span>
                </div>
                <heat-map-chart title="发推热力图（包含发推转推）" :data="accountComputedData.lovelive.tweets" year="2021"/>
                <heat-map-chart title="转推热力图" :data="accountComputedData.lovelive.retweet" year="2021" class="mb-2"/>
                <div class="row" >
                  <bar-stack-chart-for-annual2021 title="时间段" :data="{tweet: accountComputedData.lovelive.hourCount, media: accountComputedData.lovelive.mediaCount}" class="col-12 col-lg-6 mb-2"/>
                  <pie-chart title="发推时间段" :chart-data="accountComputedData.lovelive.hourCount" class="col-12 col-lg-6 mb-2"/>
                </div>
                <sun-burst-chart-for-annual2021 class="mb-2" title="改名部" subtitle="让我看看是谁在改名" :data="accountComputedData.lovelive.renameDepartment" />

                <word-cloud-chart-for-annual2021 :data="projectHashtagList.lovelive" title="标签云" subtitle="片假地狱" />

                <bar-race-for-annual2021 v-if="accountComputedData.lovelive.trendsData.followers.length" :data="accountComputedData.lovelive.trendsData.followers" :colors="accountColor.member" title="关注增量排序" :label-map="accountComputedData.lovelive.trendsData.label" />

                <tmv2-chart class="mb-2" :chart-rows="accountComputedData.lovelive.trendsData.followers" :label-map="accountComputedData.lovelive.trendsData.label"
                            chart-type="line" chart-height="600px" :colors="accountComputedData.lovelive.trendsData.color" :set-option="{notMerge: true}" title="关注增量"></tmv2-chart>
                <tmv2-chart class="mb-2" :chart-rows="accountComputedData.lovelive.trendsData.statuses_count" :label-map="accountComputedData.lovelive.trendsData.label"
                            chart-type="line" chart-height="600px" :colors="accountComputedData.lovelive.trendsData.color" :set-option="{notMerge: true}" title="推文增量"></tmv2-chart>
                <h5>备注</h5>
                <ul>
                  <li>增量图表没有出现 <router-link to="/homoto_akina/all">法元明菜 (@homoto_akina)</router-link> 和 <router-link to="/uchida_shu0524/all">内田 秀 (@uchida_shu0524)</router-link> ，因为两者均为年中添加，没有初始数据</li>
                  <li>全程都没有出现 <router-link to="/INFO_shikaco/all">久保由利香 (@INFO_shikaco)</router-link> ，这是我的失误，没有发现 Twitter Monitor 中添加的是 <router-link to="/shikaco_staff/all">久保由利香staff (@shikaco_staff)</router-link> ，我们会在明年的年度数据中使用 <router-link to="/INFO_shikaco/all">@INFO_shikaco</router-link> 的数据</li>
                </ul>
              </div>
              <div id="annual2021official" class="mb-4" >
                <h4>官推</h4>
                <p class="text-muted">包括 Love Live! 和 BanG Dream!</p>
                <div class="my-1">
                  <span type="button" @click="swapGroupStatus('official', group)" :class="{'badge': true, 'me-1': true, 'text-white': true}" :style="{'background-color': selected ?( group === 'BanGDream!' ? '#E4003DD9' : '#1DA1F2FF') : '#6c757d'}" v-for="(selected, group) in accountListFilter.official" :key="group">{{group}}</span>
                </div>
                <heat-map-chart title="发推热力图（包含发推转推）" :data="accountComputedData.official.tweets" year="2021"/>
                <heat-map-chart title="转推热力图" :data="accountComputedData.official.retweet" year="2021" class="mb-2"/>
                <div class="row" >
                  <bar-stack-chart-for-annual2021 title="时间段" :data="{tweet: accountComputedData.official.hourCount, media: accountComputedData.official.mediaCount}" class="col-12 col-lg-6 mb-2"/>
                  <pie-chart title="发推时间段" :chart-data="accountComputedData.official.hourCount" class="col-12 col-lg-6 mb-2"/>
                </div>
                <sun-burst-chart-for-annual2021 class="mb-2" title="改名部" subtitle="让我看看是谁在改名" :data="accountComputedData.official.renameDepartment" />
                <tmv2-chart class="mb-2" :chart-rows="accountComputedData.official.trendsData.followers" :label-map="accountComputedData.official.trendsData.label"
                            chart-type="line" chart-height="600px" :set-option="{notMerge: true}" title="关注增量"></tmv2-chart>
                <tmv2-chart class="mb-2" :chart-rows="accountComputedData.official.trendsData.statuses_count" :label-map="accountComputedData.official.trendsData.label"
                            chart-type="line" chart-height="600px" :set-option="{notMerge: true}" title="推文增量"></tmv2-chart>
              </div>
              <h3>一些别的话</h3>
              <p class="text-muted">我来作为一个长...</p>
              <p>
                不要直接塞一个超大的文档进 <code>webpack</code>，会变得不幸<br>
                提前一个月开始写并没有什么用，最后还是临近结束才搞出个雏形<br>
                总之，希望明年还能继续在这里见面<br>
                为什么不分开做每个企划的表格？因为我懒，不想重复造<br>
                官号的图表也有<router-link to="/i/topics/staff_data_page/">更详细的版本</router-link>，这里只是顺手做的
              </p>
              <h3>数据</h3>
              <p>本页内容及下列数据在 <a href="https://creativecommons.org/licenses/by-sa/4.0/legalcode.zh-Hans" target="_blank">署名—相同方式共享 4.0 协议国际版</a> 之条款下提供</p>
              <ul>
                <li><a :href="store.getters.getBasePath + '/static/db/annual2021.json'" target="_blank">本页数据</a></li>
                <li><a :href="store.getters.getBasePath + '/static/db/annual2021Full.json'" target="_blank">更详细的年度数据</a></li>
              </ul>
            </div>
          </div>
        </div>
        <p class="lead text-center mb-4">Project Twitter Monitor</p>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script lang="ts">
import {useHead} from "@vueuse/head";
import Tmv2Chart from "@/components/Charts/Tmv2ChartWithoutDataSet.vue";
import HeatMapChart from "@/components/Charts/HeatMapChart.vue";
import PieChart from "@/components/modules/pieChart.vue";
import BarStackChartForAnnual2021 from "@/components/Charts/BarStackChart.vue";
import SunBurstChartForAnnual2021 from "@/components/Charts/SunBurstChart.vue";
import WordCloudChartForAnnual2021 from "@/components/Charts/WordCloudChart.vue";
import BarRaceForAnnual2021 from "@/components/Charts/BarRaceCharts.vue";
import SinglePageHeader from "@/components/SinglePageHeader.vue";
import {Notice, ScrollTo} from "@/share/Tools";
import {useStore} from "@/store";
import {onMounted, reactive, Ref, ref, toRefs, watch} from "vue";
import {ApiAnnual2021} from "@/type/Api";
import {Annual2021DataTemplate, Annual2021Template, Annual2021TmpDataTemplate} from "@/type/Content";
import {cloneDeep} from "lodash-es";

export default {
  name: "annual2021",
  components: {
    SinglePageHeader,
    BarRaceForAnnual2021,
    WordCloudChartForAnnual2021,
    SunBurstChartForAnnual2021, BarStackChartForAnnual2021, PieChart, HeatMapChart, Tmv2Chart},
  setup() {
    useHead({
      title: '2021统计',
      meta: [{
        name: "theme-color",
        content: "#1da1f2"
      }]
    })

    const serverStatusLabel = {
      totalTweets: {"date": "日期", "total_tweets": "每日处理推文数", "tweets_count": "总处理推文数", "avg_tweets": "平均每次处理条数"},
      totalTime: {"date": "日期", "total_time_cost": "总耗时", "max_time_cost": "最大耗时", "min_time_cost": "最小耗时", "avg_time_cost": "平均耗时",},
      successRate: {"date": "日期", "success_rate": "成功率",},
      onlineRate: {"date": "日期", "online_rate": "在线率", "down_time_count": "离线时长"}
    }
    const projects = [{"text": "BanGDream!", "value": "BanGDream!"}, {"text": "ARGONAVIS", "value": "ARGONAVIS"}, {"text": "LoveLive!", "value": "LoveLive!"}, {"text": "艦これ", "value": "艦これ"}, {"text": "227", "value": "227"},]
    const colorForGroup = {"BanGDream!": "", "ARGONAVIS": "success", "LoveLive!": "warning", "艦これ": "danger", "227": "info"}

    const serverStatusColor = {serverStatusTotalTweets: ['#19d4ae', '#d87a80', '#5ab1ef'], serverStatusTotalTime: ['#5ab1ef', '#fa6e86', '#ffb980', '#c4b4e4'], serverStatusTotalSuccessRate: ['#0067a6'],}

    const store = useStore()

    const state = reactive<{
      accountListFilter: Ref<{[p in string]: {[q in string]: boolean}}>
      loading: Ref<boolean>
      progress: Ref<number>
      userAddList: ApiAnnual2021["user_add_list"]
      userDeleteList: ApiAnnual2021["user_del_list"]
      hashTagList: ApiAnnual2021["hashtag_rank"]
      userData: ApiAnnual2021["user_data"]
      serverStatusMeta: ApiAnnual2021["server_status_meta"]
      accountData: Ref<ApiAnnual2021["account_data"]>
      accountColor: ApiAnnual2021["account_color"]
      accountComputedData: { [p in 'bangdream' | 'lovelive' | 'official']: Annual2021DataTemplate } | {}
      projectHashtagList: ApiAnnual2021["single_project_hashtag"]
      displayNameList: ApiAnnual2021["display_name_list"]
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
        lovelive: {"μ's": true, "A-RISE": true, "Aqours": true, "Saint Snow":  true, "虹ヶ咲学園": true, "Liella!": true,},
        official: {"BanGDream!": true, "LoveLive!": true}
      }),
      loading: ref(true),
      progress: ref(0),
      userAddList: [],
      userDeleteList: [],
      hashTagList: [],
      userData: [],
      serverStatusMeta: [],
      accountData: ref([]),
      accountColor: {},
      accountComputedData: {},
      projectHashtagList: {},
      displayNameList: {},
      serverStatusChartMeta: {serverStatusTotalTweets: [], serverStatusTotalTime: [], serverStatusTotalSuccessRate: [], serverStatusTotalOnline: [],},
      renderFlag: setTimeout(() => {}, 0),
      accountDataCache: new Map(),
      groupDataCache: new Map(),
    })

    const filterTag = (value: string, row: any) => {
      for (let x in row.group) {
        if (x === value) {return true}
      }
      return false
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
      let data: ApiAnnual2021 = JSON.parse(new TextDecoder("utf-8").decode(chunksAll))
      state.displayNameList = data.display_name_list
      state.userAddList = data.user_add_list
      state.userDeleteList = data.user_del_list
      state.hashTagList = data.hashtag_rank
      state.userData = data.user_data
      state.serverStatusMeta = data.server_status_meta
      state.accountData = data.account_data
      state.accountColor = data.account_color
      state.projectHashtagList = data.single_project_hashtag
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
          let tmpOrigin = Object.values(state.accountListFilter[projectName])
          for (let valueIndex in tmp) {
            if (tmp[valueIndex] !== tmpOrigin[valueIndex]) {
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
            let tmpRetweetCount = typeof(account.daily_data[date].origin) === 'undefined' ? 0 : tmpDailyTweetCount - (account.daily_data[date].origin)
            tmpPersonData.tweets[tmpDate] ? tmpPersonData.tweets[tmpDate] += tmpDailyTweetCount : tmpPersonData.tweets[tmpDate] = tmpDailyTweetCount
            tmpPersonData.retweet[tmpDate] ? tmpPersonData.retweet[tmpDate] += tmpRetweetCount : tmpPersonData.retweet[tmpDate] = tmpRetweetCount
            account.daily_data[date].hour_count.forEach((count, time) => {
              tmpPersonData.hourCount[time] += count
            })
            account.daily_data[date].media.forEach((count, time) => {
              tmpPersonData.mediaCount[time] += count
            })

            //三大件
            if ((account.name !== 'homoto_akina') && (account.name !== 'uchida_shu0524')) {
              tmpPersonData.trendsData.followers[tmpDate] = account.daily_data[date].followers ? account.daily_data[date].followers : NaN
              tmpPersonData.trendsData.statuses_count[tmpDate] = account.daily_data[date].statuses_count ? account.daily_data[date].statuses_count : NaN
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
            if ((account.name !== 'homoto_akina') && (account.name !== 'uchida_shu0524')) {
              let baseFollowers: number | string = tmpPersonData.trendsData.followers["2021-01-01"]//only bangdream
              Object.keys(tmpPersonData.trendsData.followers).forEach(date => {
                if (!tmpGroupData.trendsData.followers[date]) {
                  tmpGroupData.trendsData.followers[date] = {}
                }
                tmpGroupData.trendsData.followers[date][account.name] = Number(tmpPersonData.trendsData.followers[date]) - Number(baseFollowers)// (tmpProject === 'bangdream' ? baseFollowers : 0)
              })

              let baseStatusesCount: number | string = tmpPersonData.trendsData.statuses_count["2021-01-01"]//only bangdream
              Object.keys(tmpPersonData.trendsData.statuses_count).forEach(date => {
                if (!tmpGroupData.trendsData.statuses_count[date]) {
                  tmpGroupData.trendsData.statuses_count[date] = {}
                }
                tmpGroupData.trendsData.statuses_count[date][account.name] = Number(tmpPersonData.trendsData.statuses_count[date]) - Number(baseStatusesCount)// (tmpProject === 'bangdream' ? baseStatusesCount : 0)
              })
            }
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
      fetch(store.getters.getBasePath + "/static/db/annual2021.json").then((response: Response) => {
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
          state.progress = Math.floor((bytesReceived / 5242672) * 100)//不要想太多, 这个数字只是文件大小已知而已
          return reader.read().then(processResult)
        })
      }).catch(e => {
        Notice(e.toString(), 'error')
      })
    })

    watch(() => state.accountListFilter, () => {renderAll()}, {deep: true})

    return {
      ...toRefs(state),
      ScrollTo,
      store,
      filterTag,
      serverStatusLabel,
      serverStatusColor,
      projects,
      colorForGroup,
      swapGroupStatus
    }
  }
}
</script>

<style scoped>

</style>
