<template>
  <div id="app">
    <div style="position: absolute"></div>
    <el-backtop></el-backtop>
    <user-selector v-if="tweetStatus.displayType === 'userSelector'" :names="names" :display-type="tweetStatus.displayType" :project="project" :projects="$root.projects" :home="home" :search="search" :user-with-project-list="userWithProjectList"  />
    <router-view v-else-if="tweetStatus.displayType === 'about' || tweetStatus.displayType === 'api' || tweetStatus.displayType === 'serverStatus' || tweetStatus.displayType === 'stats' || tweetStatus.displayType === 'Online' || tweetStatus.displayType === 'account'"/>
    <template v-else>
      <nav class="navbar navbar-expand-lg navbar-light text-center bg-light sticky-top" id="nav">
        <span class="navbar-brand mb-0 h1 d-inline-block text-truncate" style="max-width: 250px;">
          {{ displayName }}
        </span>
        <div class="btn-group" role="group">
          <button class="navbar-toggler" type="button" @click="$router.go(-1)"><span>
            <chevronLeft status="text-success" width="30" height="30" />
          </span>
          </button>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" v-if="project && $root.projects.length && tweetStatus.displayType === 'timeline'">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse" id="navbarNav" v-if="tweetStatus.displayType === 'timeline'">
          <ul class="navbar-nav" v-if="project">
            <li class="nav-item dropdown" v-for="(values, key) in names[project]" :key="key">
              <router-link style="cursor:pointer" is="a" class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-if="names[project][key].length > 1" to="">
                {{ key }}
              </router-link>
              <router-link class="nav-link" :to="`/`+(values[0].projects.length <= 1 ? '' : 'project/'+project+'/')+values[0].name+`/all`" v-else>{{ values[0].display_name }}</router-link>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown" v-if="names[project][key].length > 1" z-index="9999">
                <div v-for="value in values" :key="value.display_name">
                  <router-link :to="`/`+value.name+`/all`" :class="`dropdown-item `+(value.name ? '' : 'disabled')">{{ value.display_name }}</router-link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <div class="my-4"></div>
      <main role="main" class="container" id="main">
        <div class="row">
          <div class="col-md-4">
            <template v-if="tweetStatus.userExist">
              <el-skeleton avatar active :paragraph="{rows: 5}" :loading="load.leftCard">
                <div class="card">
                  <template>
                    <div class="row no-gutters">
                      <el-image v-if="info.banner !== '0' && tweetStatus.displayType !== 'search' && tweetStatus.displayType !== 'tag'" fit="cover" style="max-height: 20vh" class="col-12 card-img-top" :src="basePath+`/api/v2/media/userinfo/pbs.twimg.com/profile_banners/`+info.uid+`/`+info.banner+`.banner`" alt="Banner" :preview-src-list="[basePath+`/api/v2/media/userinfo/pbs.twimg.com/profile_banners/`+info.uid+`/`+info.banner+`.banner`]"></el-image>
                    </div>
                    <div class="card-body">
                      <h3 v-if="tweetStatus.displayType === 'search'">搜索</h3>
                      <router-link :to="`/hashtag/`+tag.text" v-else-if="tweetStatus.displayType === 'tag' && tag.type === 0"><h3>#{{ tag.text }}</h3></router-link>
                      <router-link :to="`/cashtag/`+tag.text" v-else-if="tweetStatus.displayType === 'tag' && tag.type === 1"><h3>${{ tag.text }}</h3></router-link>
                      <div class="container" v-else>
                        <div class="row">
                          <div class="col-4" style="max-height: 100px; max-width: 100px">
                            <el-image class="rounded-circle img-fluid" :src="basePath+`/api/v2/media/userinfo/`+info.header" v-if="info.header" lazy :preview-src-list="[basePath+`/api/v2/media/userinfo/`+info.header]">
                              <div slot="error" class="image-slot">
                                <el-skeleton active avatar :paragraph="false" :title="false" />
                              </div>
                              <div slot="placeholder" class="image-slot" >
                                <el-skeleton active avatar :paragraph="false" :title="false" />
                              </div>
                            </el-image>
                            <div class="my-4"></div>
                          </div>
                          <div class="col-8">
                            <h5 class="card-title mt-0">
                              <b>{{ info.display_name }}</b>
                              <verified status="text-primary" width="1em" height="1em"  v-if="info.verified" />
                              <deleted status="text-primary" width="1em" height="1em"  v-if="info.deleted" />
                              <locked status="text-primary" width="1em" height="1em" v-else-if="info.locked" />
                            </h5>
                            <p>
                              <small>
                                <a :href="`//twitter.com/`+info.name" target="_blank" class="text-dark">@{{ info.name }}</a>
                              </small>
                            </p>
                          </div>
                        </div>
                        <p v-html="`<p class='card-text'>`+info.description+`</p>`"></p>
                        <translate :basePath="basePath" :type="1" :id="info.uid" :to="settings.data.language" />
                      </div>
                    </div>
                  </template>
                </div>
              </el-skeleton>
              <template v-if="tweetStatus.displayType === 'timeline'">
                <!--Load data-->
                <div class="my-4"></div>
                <template v-if="chart.chartData">
                  <el-skeleton active :title="false" :paragraph="{rows: 4}" :loading="!chart.chartData.rows.length">
                    <ve-line :data="chart.chartData" :settings="chart.chartSettings" :extend="chart.chartOptions" :init-options="{renderer: 'svg'}" :height="chart.chartHeight"></ve-line>
                  </el-skeleton>
                </template>
              </template>
              <div class="my-4"></div>
            </template>
          </div>
          <div class="col-md-6">
            <div v-if="!tweetStatus.userExist">
              <h5 class="mx-auto">@{{ name }} 不存在</h5>
              <div class="my-4"></div>
            </div>
            <template v-else>
              <search :name="name" :search="search" :display-type="tweetStatus.displayType"/>
              <div class="my-4"></div>
              <nav class="nav nav-pills nav-fill">
                <template  v-if="tweetStatus.displayType === 'timeline' && !load.leftCard">
                  <li class="nav-item" v-for="(value, s) in displayMode" :key="s">
                    <div class="nav-link active" @click="loading( 0)" style="cursor:pointer" v-if="value[1] === tweetStatus.display">{{ value[0] }}</div>
                    <router-link :to="`/`+info.name+`/`+value[1]" class="nav-link" v-else>{{ value[0] }}</router-link>
                  </li>
                </template>
                <li class="nav-item">
                  <div :class="`nav-link `+(settings.data.displayPicture ? 'active' : 'text-primary')" @click="settings.data.displayPicture=!settings.data.displayPicture" style="cursor:pointer">无图</div>
                </li>
              </nav>
              <hr class="my-4">
              <!--user tweets-->
              <el-skeleton :paragraph="{rows: 5}" :loading="load.timeline" active>
                <div>
                  <template v-if="tweetStatus.displayType === 'timeline' && (info.deleted || info.locked)">
                    <div class="card card-border border-info" id="alertMsg">
                      <div class='card-body'>
                        {{ '此账户已'+(info.deleted ? '删除' : '被保护')+'，我们将不再监控此账户' }}
                      </div>
                    </div>
                    <hr class="my-4">
                  </template>
                  <div v-if="tweetStatus.reload" class="text-center">
                    <el-button round icon="el-icon-refresh-left" @click="() => {load.timeline=true;update()}">重试</el-button>
                  </div>
                  <div v-if="load.top" class="text-center" v-loading="load.top" style="height: 60px" element-loading-background="rgba(255, 255, 0, 0)"></div>
                  <div v-if="!tweetStatus.reload && tweets.length">
                    <div v-for="(tweet, order) in tweets" :key="order">
                      <div v-if="tweet.type === 'msg'" class="text-center">
                        {{ tweet.full_text }}
                      </div>
                      <div v-else>
                        <div :class="`card card-border`+((tweetStatus.displayType === 'timeline' && tweet.tweet_id === info.top) ? ' border-primary' : '')" :id="tweet.tweet_id">
                          <div class='card-body'>
                            <p v-if="tweetStatus.displayType === 'timeline' && tweet.tweet_id === info.top"><small class="text-muted">置顶推文</small></p>
                            <div>
                              <small v-if="tweet.retweet_from" class="text-muted">
                                <retweet status="" width="1em" height="1em"/>
                                <router-link :to="`/`+tweet.name+(tweetStatus.displayType === 'status' ? `/` + tweetStatus.display : `/status/`+tweet.tweet_id)" class="text-muted">
                                  {{ tweet.display_name }}
                                </router-link>
                              </small>
                            </div>
                            <template>
                              <router-link :to="`/`+tweet.name+(tweetStatus.displayType === 'status' ? `/all` : `/status/`+tweet.tweet_id)" class="card-title text-dark">
                                {{ tweet.retweet_from ? tweet.retweet_from : tweet.display_name }}
                              </router-link>
                              | <small>@{{ tweet.retweet_from ? tweet.retweet_from_name : tweet.name }}</small>
                            </template>
                            <!--media-->
                            <span v-if="tweet.media === '1'" @click="settings.data.displayPicture=!settings.data.displayPicture" style="cursor:pointer">
                            <image-icon status="text-success" width="2em" height="2em" />
                          </span>
                            <camera-video-icon status="text-danger" width="2em" height="2em"  v-if="tweet.video === '1'"/>
                            <a :href="`//twitter.com/i/status/`+tweet.tweet_id" target="_blank">
                              <box-arrow-up-right status="text-primary" width="2em" height="2em" />
                            </a>
                            <div class="my-4"></div>
                            <!--<div v-html="`<p class='card-text'>`+tweet.full_text+`</p>`"></div>-->
                            <!--excited!-->
                            <html-text :full_text_origin="tweet.full_text_origin" :entities="tweet.entities"/>
                            <translate :type="0" :id="tweet.tweet_id" :to="settings.data.language" />
                            <!--media-->
                            <template v-if="tweet.media === '1'&&!settings.data.displayPicture">
                              <div class="my-4"></div>
                              <image-list :list="tweet.mediaObject.tweetsMedia" :is_video="tweet.video" :unlimited="tweetStatus.displayType === 'status'" />
                            </template>
                            <!--quote-->
                            <template v-if="tweet.quote_status !== '0'">
                              <div class="my-4"></div>
                              <quote-card :quote-object="tweet.quoteObject" :quote-media="tweet.mediaObject.quoteMedia" :base-path="basePath" :display-picture="settings.data.displayPicture" :language="settings.data.language" :now="now" />
                            </template>
                            <!--polls-->
                            <template v-if="tweet.poll === '1'">
                              <tw-polls :polls="tweet.pollObject" :tweet_id="tweet.tweet_id" :language="settings.data.language" :media="tweet.mediaObject.cardMedia" :now="now" />
                            </template>
                            <!--card-->
                            <template v-else-if="tweet.card !== ''">
                              <div class="my-4"></div>
                              <tw-card :object="tweet.cardObject" :media="tweet.mediaObject.cardMedia" :mediaState="!settings.data.displayPicture"></tw-card>
                            </template>
                            <!--time && source-->
                            <div id="foot">
                              <small class="text-muted">{{ timeGap(tweet.time, now, settings.data.language) }} · <span style="color: #1DA1F2">{{ tweet.source }}</span></small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr class="my-4">
                    </div>
                    <template>
                      <button type="button" class="btn btn-primary btn-lg btn-block" @click="loading(1)" v-if="tweetStatus.moreTweets && !load.bottom">
                        <span>加载更多</span>
                      </button>
                      <el-skeleton :paragraph="{rows: 1}" v-else-if="tweetStatus.moreTweets && load.bottom" active/>
                      <div v-else-if="!(tweetStatus.displayType === 'status')">
                        <h5 class="text-center">已经没有更多内容</h5>
                      </div>
                    </template>
                  </div>
                  <div v-else-if="!tweetStatus.reload">
                    <h5 class="text-center">已经没有更多内容</h5>
                  </div>
                </div>
              </el-skeleton>
              <div class="my-4"></div>
            </template>
          </div>
          <div class="col-md-2">
            <!--有确定的project-->
            <template v-if="project">
              <button class="btn btn-outline-primary btn-block btn-sm" @click="projectS = !projectS">{{ project }}</button>
              <div  class="my-4"></div>
            </template>
            <!--未确定project-->
            <template v-else>
              <router-link class="btn btn-outline-primary btn-block btn-sm" to="/">选择企划</router-link>
              <div class="my-4"></div>
            </template>
            <template v-if="projectS">
              <div class="list-group">
                <router-link :to="`/i/project/`+project_" :class="`list-group-item list-group-item-action`+(project_.toLowerCase() === project.toLowerCase() ? ' active' : '')" v-for="project_ in $root.projects" :key="project_" @click="projectS = !projectS">{{ project_ }}</router-link>
              </div>
              <div class="my-4"></div>
            </template>
            <div class="mb-1">
              <span style="cursor:pointer" class="text-decoration-none badge badge-pill badge-primary" @click="settings.panel = true">设置</span>
              <router-link class="text-decoration-none badge badge-pill badge-primary" to="/about">关于</router-link>
              <router-link class="text-decoration-none badge badge-pill badge-primary" to="/i/stats">统计</router-link>
              <a class="text-decoration-none badge badge-pill badge-primary" :href="basePath + `/api/v2/rss/` + info.name + `.xml`" v-if="tweetStatus.displayType === 'timeline' || tweetStatus.displayType === 'status'">RSS</a>
            </div>
            <hr class="my-4">
            <template v-for="(link, s) in links">
              <span :key="s" v-if="s!==0"> · </span>
              <a :href="link.url" target="_blank" :key="link.url+s" class="text-muted"><small>{{ link.display }}</small></a>
            </template>
            <div class="my-4"></div>
          </div>
        </div>
        <!--setting-->
        <el-drawer title="设置" :visible.sync="settings.panel" direction="btt">
          <div class="modal-body">
            <label for="selectLaguage">语言</label>
            <select id="selectLaguage" v-model="settings.data.language" class="form-control">
              <option :value="language.code" :selected="settings.data.language === language.code" v-for="language in languageList" :key="language.code">{{ language.local_name }}</option>
            </select>
          </div>
        </el-drawer>
      </main>
    </template>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueRouter from 'vue-router'
  import imageList from './components/modules/imageList.vue'
  import twPolls from './components/modules/twPolls.vue'
  import axios from 'axios'
  import twCard from "./components/modules/twCard";
  import translate from "./components/modules/translate";
  import chevronLeft from "./components/icons/chevronLeft";
  import Verified from "./components/icons/verified";
  import Deleted from "./components/icons/deleted";
  import Locked from "./components/icons/locked";
  import Retweet from "./components/icons/retweet";
  import BoxArrowUpRight from "./components/icons/boxArrowUpRight";
  import CameraVideoIcon from "./components/icons/cameraVideoIcon";
  import ImageIcon from "./components/icons/imageIcon";
  import QuoteCard from "./components/modules/quoteCard";
  import Search from "./components/modules/search";
  import UserSelector from "./components/pages/userSelector";
  import About from "./components/pages/about";
  import Api from "./components/pages/api";
  import Account from "./components/pages/account";
  import Stats from "./components/pages/stats";
  import Status from "./components/pages/status";
  import Online from "./components/pages/online";
  import HtmlText from "./components/modules/htmlText";
  //import LeftCard from "./components/template/leftCard";
  const CancelToken = axios.CancelToken;
  let cancel;
  Vue.use(VueRouter);
  export default {
    name: 'App',
    components: {
      HtmlText,
      //LeftCard,
      UserSelector,
      Search,
      QuoteCard,
      ImageIcon,
      CameraVideoIcon,
      BoxArrowUpRight,
      Retweet,
      Locked,
      Deleted,
      Verified,
      twCard,
      imageList,
      twPolls,
      translate,
      chevronLeft,
    },
    data() {
      return {
        displayName: "Twitter",
        now: new Date(),
        height: 0,
        tag: {
          text: '',
          type: 0
        },
        load: {
          leftCard: true,
          timeline: true,
          top: false,
          bottom: false,
        },
        search: {
          keywords: '',
          mode: 0,//0->keywords, 1->date
        },
        project: "",
        projectS: false,
        //projects: [],
        is_project: '',
        names: {},
        //nsfwList: [],
        links: [],
        info: [],
        tweets: [],
        name: "",
        home: true,
        tweetStatus: {
          displayType: "userSelector",//timeline, tag, search, status, userSelector, about, account
          display: 'all',
          moreTweets: true,
          topTweetId: 0,
          bottomTweetId: 0,
          reload: false,
          userExist: true,
          lock: false,
          //statusMode: false,
        },
        displayMode: [['全部', 'all', 0], ['原创', 'self', 0], ['转推', 'retweet', 0], ['媒体', 'media', 0]],
        chart: {
          chartHeight: "250px",
          chartData: {
            columns: ['timestamp', 'followers', 'following', 'statuses_count'],
            rows: []
          },
          chartSettings: {
            labelMap: {
              'timestamp': '日期',
              'followers': '关注者',
              'following': '正在关注',
              'statuses_count': '总推文数',
            },
            legendName: {},
            scale: [true, true],
          },
          chartOptions: {
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
          },
        },
        languageList: [],
        settings: {
          data: {
            language: /zh/.test(window.navigator.language.toLowerCase()) ? window.navigator.language.toLowerCase() : 'en',
            cookie_accept: false,
            displayPicture: false,
          },
          panel: false,
        },
      };
    },
    metaInfo () {
      return {
        title: this.displayType,
        htmlAttrs: {
          lang: 'zh',
        }
      }
    },
    computed: {
      userList: function() {
        let users = [];
        Object.keys(this.names).forEach(value1 => {
          Object.keys(this.names[value1]).forEach(value2 => {
            Object.keys(this.names[value1][value2]).forEach(value3 => {
              users.push({name: this.names[value1][value2][value3]["name"], display_name: this.names[value1][value2][value3]["display_name"], project: value1, tag: value2});
            })
          })
        });
        return users;
      },
      userWithProjectList: function() {
        let list = [];
        this.userList.forEach(values => {
          if (values.project === this.project && values.name) {
            list.push(values);
          }
        });
        return list;
      },
      userTimeZone: function() {
        let timeValue = (new Date().getTimezoneOffset()/60)*(-1);
        return timeValue >= 0 ? '+'+timeValue.toString() : timeValue.toString();
      },
    },
    router: new VueRouter({
      mode: 'history',//hash history
      base: '/twitter/',//hash mode not require
      routes: [
        {
          path: '/about',
          component: About
        },
        {
          path: '/api',
          component: Api
        },
        {
          path: '/account',
          component: Account
        },
        {
          path: '/i/stats',
          component: Stats
        },
        {
          path: '/i/status',
          component: Status
        },
        {
          path: '/i/online',
          component: Online
        },{
          path: '/hashtag/:hashtag',
        },{
          path: '/cashtag/:cashtag',
        },{
          path: '/search/:search',
        },
        {
          path: '/i',
          children: [
            {
              path: 'project/:project',
              children: [
                {path: ':name'},
                {path: ':name/:display'},
                {path: ':name/status/:status'}
              ]
            }
          ]
        },{
          path: '/:name',
          children: [
            {path: ''},
            {path: ':display'},
            {path: 'status/:status'}
          ]
        }
      ]
    }),
    watch: {
      "$route.path":  {
        handler: function () {
          //console.log(this.$route.path);
          //this.scrollToTop();

          //处理未加载完成的
          cancel();
          this.tweetStatus.userExist = true;
          this.scrollToTop();
          this.is_project = this.$route.path.substr(3, 7);//提前处理
          this.routeCase();
          if (this.lock) {
            this.load.timeline = true;
            this.update();
            //if (this.load.leftCard === true && this.tweetStatus.displayType === 'timeline') {
            //  this.getUserInfo(this.name);
            //}
          }
        },
        deep: true,
      },
      "tweetStatus.displayType": {
        handler: function () {
          //暴力处理
          if (this.ready) {
            window.stop();
          }
        },
        deep: true
      },
      "tweetStatus.display": {
        handler: function () {
          //暴力处理
          if (this.ready) {
            window.stop();
          }
        },
        deep: true
      },
      "name": function () {
        if (this.lock) {
          //clean
          this.chart.chartData.rows = [];
          this.getUserInfo(this.name);
        }
      },
      "info": function(){
        //バンドリ！ BanG Dream! 公式 (@bang_dream_info) / Twitter
        this.changeTitle(this.info.display_name ? this.info.display_name + ' (@' + this.info.name + ') / Twitter Monitor' : "Twitter Monitor");
        //this.display_name = this.info.display_name;
      },
      "search.keywords": {
        handler: function () {
          if (this.search.mode === 1 && this.tweetStatus.displayType !== 'userSelector') {
            this.load.timeline = true;
            this.update();
          }
        },
        deep: true,
      },
      "search.mode": {
        handler: function() {
          this.search.keywords = '';
        },
        deep: true,
      }
    },
    mounted: function () {
      new CancelToken(c => cancel = c);//提前生成
      this.localrun();
      //处理路由
      this.routeCase();
      //check $route
      if (this.lock) {
        this.update();
      }
      let startTime = Date.now();
      axios.all([this.getAccountList(), this.getLanguageList()]).then(axios.spread((accountList, languageList) => {
        this.languageList = languageList.data;
        this.names = accountList.data.account_info;
        this.$root.projects = accountList.data.projects;
        this.links = accountList.data.links;
        //处理网速
        if(Date.now() - startTime > 3000){
          this.settings.data.displayPicture = true;
          this.notice('当前网速较慢，已关闭图片显示', 'warning');
        }
      })).catch(error => {
        this.notice(error, 'error');
      });
    },
    methods: {
      getAccountList: function () {
        return axios.get(this.basePath + (process.env.NODE_ENV !== "development" ? "/account_info_t.json" : "/proxy.php?filename=account_info_t"));
      },
      getLanguageList: function () {
        return axios.get(this.basePath + (process.env.NODE_ENV !== "development" ? "/language_target.json" : "/proxy.php?filename=language_target"));
      },
      changeTitle: function (text = "") {
        document.title = text;
      },
      updateNow: function () {
        this.now = new Date();
        setTimeout(this.updateNow, 1000);
      },
      scrollToTop: function (top = 0) {
        window.scrollTo({
          top: top,
          behavior: "smooth"
        });
      },
      timeGap: function (timestamp, now, language) {
        let gap = (now - (timestamp * 1000))/1000;
        if (gap < 60) {
          return gap + '秒';
        } else if (gap < 3600) {
          return Math.floor(gap/60) + '分钟';
        } else if (gap < 86400) {
          return Math.floor(gap/3600) + '小时';
        } else {
          return (new Date(timestamp * 1000)).toLocaleString(language);
        }
      },
      loading: function (type = 0) {
        if (this.tweetStatus.bottomTweetId && this.tweetStatus.topTweetId) {
          //0 -> top, 1 -> bottom
          this.load[(type === 0 ? 'top' : 'bottom')] = true;
          axios.get(this.mergeUrl()+(type === 0 ? '&refresh=1&tweet_id=' + this.tweetStatus.topTweetId.toString() : '&refresh=0&tweet_id=' + this.tweetStatus.bottomTweetId.toString()), {
            cancelToken: new CancelToken(c => cancel = c)
          }).then(response => {
            if (type === 0) {
              this.notice("已更新"+response.data.data.tweets.length+"条推文", "success");
              //this.getUserInfo();
              if (response.data.data.top_tweet_id) {
                this.tweetStatus.topTweetId = response.data.data.top_tweet_id;
              }
              this.tweets = [...response.data.data.tweets, ...this.tweets];
              this.load.top = false;
            } else {
              this.tweetStatus.moreTweets = response.data.data.hasmore;
              if (response.data.data.bottom_tweet_id) {
                this.tweetStatus.bottomTweetId = response.data.data.bottom_tweet_id;
              }
              this.tweets.push(...response.data.data.tweets);
              this.load.bottom = false;
            }
          }).catch(error => {
            if (error.toString() !== 'Cancel') {this.notice(error, "error")}
            this.load[(type === 0 ? 'top' : 'bottom')] = false;
          });
        } else {
          this.notice("缺少参数", "error");
        }
      },
      getUserInfo: function (name) {
        this.load.leftCard = true;
        axios.get(this.basePath + '/api/v2/data/userinfo/?name=' + name, {
          cancelToken: new CancelToken(c => cancel = c)
        }).then(response => {
          this.info = response.data.data;
          if (response.data.code === 200) {
            this.chart.chartSettings.legendName = {'关注者': '关注者 ' + this.info.followers, '正在关注': '正在关注 ' + this.info.following, '总推文数': '总推文数 ' + this.info.statuses_count};
            this.createChart();
          } else {
            this.notice(response.data.message, "error");
            this.chart.chartSettings.legendName = {'关注者': '关注者', '正在关注': '正在关注', '总推文数': '总推文数'};
            this.tweetStatus.userExist = false;
          }
          this.load.leftCard = false;
        }).catch(error => {
          if (error.toString() !== 'Cancel') {this.notice(error, "error")}
          //this.load.leftCard = false;
        });
      },
      createChart: function(){
        axios.get(this.basePath + '/api/v2/data/chart/?uid=' + this.info.uid).then(response => {
          this.chart.chartData.rows = response.data.data;
          if (!this.chart.chartData.rows.length) {
            this.notice("chart: " + response.data.message, "warning");
          }
        }).catch(error => {
          if (this.tweetStatus.displayType === "timeline" && error.toString() !== 'Cancel') {
            this.notice('加载失败，5s后重试重试 #' + error, 'error');
            setTimeout(() => {this.createChart()}, 5000);
          }
        });
      },
      update: function () {
        axios.get(this.mergeUrl(), {
          cancelToken: new CancelToken(c => cancel = c)
        }).then(response => {
          this.tweets = response.data.data.tweets ? response.data.data.tweets : [];//404时无任何数据
          this.tweetStatus.moreTweets = response.data.data.hasmore;
          this.tweetStatus.topTweetId = response.data.data.top_tweet_id;
          this.tweetStatus.bottomTweetId = response.data.data.bottom_tweet_id;
          this.load.timeline = false;
          this.tweetStatus.reload = (response.data.code !== 200 && response.data.code !== 404 && response.data.code !== 403);
        }).catch(error => {
          if (error.toString() !== 'Cancel') {
            this.notice(error, "error");
            this.tweetStatus.reload = true;
            this.load.timeline = false;
          }
        })
      },
      mergeUrl: function () {
        //拼装url
        let url = this.basePath + '/api/v2/data/';
        //一层
        switch (this.tweetStatus.displayType) {
          case "timeline":
          case "status":
            url += 'tweets/';
            break;
          case "tag":
            this.search.keywords = '';
            url += (this.tag.type ? 'symbol/' : 'hashtag/') + '?hash=' + this.tag.text;
            break;
          case "search":
            url += 'search/';
            break;
        }
        //date
        if (this.search.mode === 1 && this.search.keywords) {
          url += '?name=' + this.name + '&date=' + Date.parse(this.search.keywords+' GMT'+this.userTimeZone)/1000;
        }
        else if (this.search.keywords && this.tweetStatus.displayType === 'search') {
          url += '?q=' + encodeURIComponent(this.search.keywords);
        }
        //二层
        else if(this.tweetStatus.displayType === 'timeline') {
          url += '?name=' + this.name + '&display=' + this.tweetStatus.display;
        }
        //status
        else if (this.tweetStatus.displayType === 'status') {
          url += '?name=' + this.name + '&is_status=1&tweet_id=' + this.$route.params.status;
        }
        return url;
      },
      routeCase: function () {
        //特殊类型
        if (this.$route.path === '/about') {
          this.tweetStatus.displayType = 'about';
          //this.changeTitle("关于");
          this.lock = false;
          return;
        }
        if (this.$route.path === '/api') {
          this.tweetStatus.displayType = 'api';
          this.changeTitle("API");
          this.lock = false;
          return;
        }
        if (this.$route.path === '/account') {
          this.tweetStatus.displayType = 'account';
          this.changeTitle("Account");
          this.lock = false;
          return;
        }
        if (this.$route.path === '/i/stats') {
          this.tweetStatus.displayType = 'stats';
          this.changeTitle("STATS");
          this.lock = false;
          return;
        }
        if (this.$route.path === '/i/status') {
          this.tweetStatus.displayType = 'serverStatus';
          this.changeTitle("STATUS");
          this.lock = false;
          return;
        }
        if (this.$route.path === '/i/online') {
          this.tweetStatus.displayType = 'Online';
          this.lock = false;
          return;
        }
        //none
        if (this.$route.path === '/') {
          this.home = true;
          this.changeTitle('Twitter Monitor');
          this.search.keywords = '';
          this.tweetStatus.displayType = 'userSelector';
          this.search.mode = 0;
          this.lock = false;
          return;
        }
        this.home = false;
        //project
        if (this.$route.params.project) {
          this.project = this.$route.params.project;
          this.search.keywords = '';
          if (this.$route.params.name) {
            this.lock = false;
            this.$router.replace({path: '/'+this.$route.params.name+(this.$route.params.status ? ('/status/' + this.$route.params.status + '/') : (this.$route.params.display ? ('/' + this.$route.params.display + '/') : '/all/'))});
            return;
          } else {
            this.changeTitle(this.project + ' / Twitter Monitor');
            this.tweetStatus.displayType = 'userSelector';
            this.lock = false;
            return;
          }
        }
        //name
        if (this.$route.params.name && this.$route.params.name !== 'search') {
          this.name = this.$route.params.name;
          this.tweetStatus.displayType = 'timeline';
          //display
          if (this.$route.params.display) {
            switch (this.$route.params.display.toLowerCase()) {
              case "self":
                this.tweetStatus.display = 'self';
                break;
              case "retweet":
                this.tweetStatus.display = 'retweet';
                break;
              case "media":
                this.tweetStatus.display = 'media';
                break;
              default:
                //all
                this.tweetStatus.display = 'all';
            }
            this.lock = true;
            return;
          } else if (this.$route.params.status) {
            //status
            this.tweetStatus.displayType = 'status';
            this.lock = true;
            return;
          } else {
            this.lock = false;
            this.$router.replace({path: '/'+this.name+'/all/'});
            return;
          }
        } else if (this.$route.params.name === 'search') {
          this.search.keywords = this.$route.params.search;
          this.load.leftCard = false;
          this.tweetStatus.displayType = 'search';
          this.lock = true;
          return;
        }
        //hashtag & cashtag
        if (this.$route.params.hashtag || this.$route.params.cashtag) {
          this.tag.text = this.$route.params.hashtag ? this.$route.params.hashtag : this.$route.params.cashtag;
          this.tag.type = this.$route.params.hashtag ? 0 : 1;
          this.tweetStatus.displayType = 'tag';
          this.load.leftCard = false;
          this.lock = true;
          return;
        }
        //search
        if (this.$route.params.search) {
          this.search.keywords = this.$route.params.search;
          this.load.leftCard = false;
          this.tweetStatus.displayType = 'search';
          this.lock = true;
        }
      },
      localrun: function() {
        //localStorage
        if (!localStorage.getItem('tm_settings')) {
          localStorage.setItem('tm_settings', JSON.stringify(this.settings.data));//提前写入
        } else {
          this.settings.data = JSON.parse(localStorage.getItem('tm_settings'));
        }
        //time
        this.updateNow();
      },
      notice: function(text, status = 'success') {
        this.$message({
          message: text,
          type: status
        });
      },
      //nsfwSearcher: function (name){
      //  this.nsfwList.forEach(function(nsfwname) {
      //    if(name.toLowerCase() === nsfwname){
      //      return true;
      //    }
      //  });
      //  return false;
      //},
    },
  }
</script>

<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
