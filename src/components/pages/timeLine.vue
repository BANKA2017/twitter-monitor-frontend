<template>
    <div id="timeLine">
        <navigation :display-type="tweetStatus.displayType"/>
        <div class="my-4"></div>
        <main class="container" id="main" role="main">
            <div class="row">
                <div class="col-md-4">
                    <template v-if="tweetStatus.userExist">
                        <el-skeleton :loading="load.leftCard" :paragraph="{rows: 5}" active avatar>
                            <div class="card">
                                <template>
                                    <div class="row no-gutters">
                                        <el-image
                                                :preview-src-list="[basePath+`/api/v2/media/userinfo/pbs.twimg.com/profile_banners/`+info.uid+`/`+info.banner+`.banner`]"
                                                :src="basePath+`/api/v2/media/userinfo/pbs.twimg.com/profile_banners/`+info.uid+`/`+info.banner+`.banner`"
                                                alt="Banner" class="col-12 card-img-top" fit="cover"
                                                style="max-height: 20vh"
                                                v-if="info.banner !== '0' && tweetStatus.displayType !== 'search' && tweetStatus.displayType !== 'tag'"></el-image>
                                    </div>
                                    <div class="card-body">
                                        <h3 v-if="tweetStatus.displayType === 'search'">搜索</h3>
                                        <router-link :to="`/hashtag/`+tag.text"
                                                     v-else-if="tweetStatus.displayType === 'tag' && tag.type === 0">
                                            <h3>#{{ tag.text }}</h3></router-link>
                                        <router-link :to="`/cashtag/`+tag.text"
                                                     v-else-if="tweetStatus.displayType === 'tag' && tag.type === 1">
                                            <h3>${{ tag.text }}</h3></router-link>
                                        <div class="container" v-else>
                                            <div class="row">
                                              <div class="col-12 text-right">
                                                <verified v-if="info.verified" height="1.2em" status="text-primary"
                                                          width="1.2em"/>
                                                <deleted v-if="info.deleted" height="1.2em" status="text-danger"
                                                         width="1.2em"/>
                                                <locked v-else-if="info.locked" height="1.2em" status="text-danger"
                                                        width="1.2em"/>
                                              </div>
                                              <div class="col-4" style="max-height: 100px; max-width: 100px">
                                                <el-image
                                                    :preview-src-list="[basePath+`/api/v2/media/userinfo/`+info.header]"
                                                    :src="basePath+`/api/v2/media/userinfo/`+info.header"
                                                    class="rounded-circle img-fluid" lazy v-if="info.header">
                                                  <div class="image-slot" slot="error">
                                                    <el-skeleton :paragraph="false" :title="false" active avatar/>
                                                  </div>
                                                  <div class="image-slot" slot="placeholder">
                                                    <el-skeleton :paragraph="false" :title="false" active avatar/>
                                                        </div>
                                                    </el-image>
                                                    <div class="my-4"></div>
                                                </div>
                                                <div class="col-8">
                                                    <h5 class="card-title mt-0">
                                                        <b>{{ info.display_name }}</b>
                                                    </h5>
                                                    <p>
                                                        <small>
                                                            <a :href="`//twitter.com/`+info.name" class="text-dark"
                                                               target="_blank">@{{ info.name }}</a>
                                                        </small>
                                                    </p>
                                                </div>
                                            </div>
                                            <p v-html="`<p class='card-text'>`+info.description+`</p>`"></p>
                                            <translate :id="info.uid" :to="$root.settings.data.language" :type="1"/>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </el-skeleton>
                        <template v-if="tweetStatus.displayType === 'timeline'">
                          <!--Load data-->
                          <div class="my-4"></div>
                          <el-skeleton :loading="!chart.rows.length" :paragraph="{rows: 4}" :title="false" active
                                       v-if="chart.rows && chart.generate">
                            <tmv2-chart :chart-height="chart.chartHeight" :chart-rows="chart.rows"
                                        :label-map="chart.labelMap" :legend-name="chart.legendName"
                                        chart-type="ve-line"></tmv2-chart>
                          </el-skeleton>
                          <el-table v-else
                                    :data="[{followers: info.followers, following: info.following, statuses_count: info.statuses_count}]"
                                    style="width: 100%">
                            <el-table-column label="关注者" prop="followers"></el-table-column>
                            <el-table-column label="正在关注" prop="following"></el-table-column>
                            <el-table-column label="总推文数" prop="statuses_count"></el-table-column>
                          </el-table>
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
                        <search :display-type="tweetStatus.displayType" :name="name" :search="search"/>
                        <div class="my-4"></div>
                        <nav class="nav nav-pills nav-fill">
                            <template v-if="tweetStatus.displayType === 'timeline' && !load.leftCard">
                                <li :key="s" class="nav-item" v-for="(value, s) in displayMode">
                                  <div class="nav-link active" role="button" @click="loading( 0)"
                                       v-if="value[1] === tweetStatus.display">{{ value[0] }}
                                  </div>
                                    <router-link :to="`/`+info.name+`/`+value[1]" class="nav-link" v-else>{{ value[0]
                                        }}
                                    </router-link>
                                </li>
                            </template>
                            <li class="nav-item">
                              <div
                                  :class="{'nav-link': true, 'active': $root.settings.data.displayPicture, 'text-primary': !$root.settings.data.displayPicture}"
                                  @click="$root.settings.data.displayPicture=!$root.settings.data.displayPicture"
                                  role="button">无图
                              </div>
                            </li>
                        </nav>
                        <hr class="my-4">
                        <!--user tweets-->
                        <el-skeleton :loading="load.timeline" :paragraph="{rows: 5}" active>
                            <div>
                                <template
                                        v-if="tweetStatus.displayType === 'timeline' && (info.deleted || info.locked)">
                                    <div class="card card-border border-info" id="alertMsg">
                                        <div class='card-body'>
                                            {{ '此账户已'+(info.deleted ? '删除' : '被保护')+'，我们将不再监控此账户' }}
                                        </div>
                                    </div>
                                  <hr class="my-4">
                                </template>
                              <div class="text-center" v-if="tweetStatus.reload">
                                <el-button @click="() => {load.timeline=true;update()}" icon="el-icon-refresh-left"
                                           round>重试
                                </el-button>
                              </div>
                              <div class="text-center" element-loading-background="rgba(255, 255, 0, 0)"
                                   style="height: 60px" v-if="load.top" v-loading="load.top"></div>
                              <div v-if="!tweetStatus.reload && $root.tweets.length">
                                <div v-for="(tweet, order) in $root.tweets" :key="order">
                                  <div class="text-center" v-if="tweet.type === 'msg'">
                                    {{ tweet.full_text }}
                                  </div>
                                  <div v-else>
                                    <tweet :display="tweetStatus.display"
                                           :display-type="tweetStatus.displayType" :top="info.top"
                                           :order="order"
                                           :tweet="tweet"/>
                                  </div>
                                  <hr class="my-4">
                                    </div>
                                    <template>
                                        <button @click="loading(1)" class="btn btn-primary btn-lg btn-block"
                                                type="button" v-if="tweetStatus.moreTweets && !load.bottom">
                                            <span>加载更多</span>
                                        </button>
                                        <el-skeleton :paragraph="{rows: 1}" active
                                                     v-else-if="tweetStatus.moreTweets && load.bottom"/>
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
                    <project-list/>
                  <div class="mb-1">
                        <span @click="$root.settings.panel = true"
                              class="text-decoration-none badge badge-pill badge-primary" role="button">设置</span>
                    <span class="text-decoration-none badge badge-pill badge-primary" is="router-link"
                          to="/about">关于</span>
                    <span class="text-decoration-none badge badge-pill badge-primary" is="router-link"
                          to="/i/stats">统计</span>
                    <span class="text-decoration-none badge badge-pill badge-primary" is="router-link"
                          to="/i/status">状态</span>
                    <span is="router-link" class="text-decoration-none badge badge-pill badge-primary"
                          to="/api">API</span>
                    <span :href="basePath + `/api/v2/rss/` + info.name + `.xml`"
                          class="text-decoration-none badge badge-pill badge-primary" is="a"
                          v-if="!hidden && (tweetStatus.displayType === 'timeline' || tweetStatus.displayType === 'status')">RSS</span>
                    <span is="router-link" v-if="$root.settings.adminStatus"
                          class="text-decoration-none badge badge-pill badge-dark"
                          to="/i/admin">管理</span>
                  </div>
                  <hr class="my-4">
                  <link-list/>
                </div>
            </div>
          <!--setting-->
          <settings/>
          <transition name="el-fade-in">
            <div v-if="tweetStatus.displayType === 'timeline'" class="el-backtop" style="right: 40px; bottom: 90px"
                 @click="()=>{scrollToTop();loading(0)}">
              <i class="el-icon-refresh-right"></i>
            </div>
          </transition>
        </main>
    </div>

</template>

<script>
    import axios from 'axios'
    import translate from "../modules/translate";
    import Verified from "../icons/verified";
    import Deleted from "../icons/deleted";
    import Locked from "../icons/locked";
    import Search from "../modules/search";
    import Tweet from "../modules/tweet";
    import Navigation from "../modules/Navigation";
    import Settings from "../modules/settings";
    import ProjectList from "../modules/projectList";
    import LinkList from "../modules/linkList";
    import Tmv2Chart from "@/components/modules/tmv2Chart";

    const CancelToken = axios.CancelToken;
    let cancel;
    export default {
        name: 'App',
        components: {
          Tmv2Chart,
          LinkList,
          ProjectList,
          Settings,
          Navigation,
          Tweet,
          Search,
          Locked,
          Deleted,
          Verified,
          translate,
        },
        data() {
            return {
                displayName: "Twitter",
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
              //is_project: '',
              //nsfwList: [],
              links: [],
              info: [],
              //tweets: [],
              name: "",
              hidden: false,
              tweetStatus: {
                displayType: "timeline",//timeline, tag, search, status,//后面的已独立 userSelector, about, account
                display: 'all',
                moreTweets: true,
                topTweetId: 0,
                bottomTweetId: 0,
                reload: false,
                userExist: true,
                statusId: 0,
                //lock: false,
                    //statusMode: false,
                },
                displayMode: [['全部', 'all', 0], ['原创', 'self', 0], ['转推', 'retweet', 0], ['媒体', 'media', 0]],
                chart: {
                  generate: true,
                  latestTimestamp: 0,
                  chartHeight: "250px",
                  rows: [],
                  labelMap: {
                    'timestamp': '日期',
                    'followers': '关注者',
                    'following': '正在关注',
                    'statuses_count': '总推文数',
                  },
                  legendName: {},
                },
            };
        },
        metaInfo() {
            return {
              title: this.$root.title,
              htmlAttrs: {
                lang: 'zh',
              }
            }
        },
        computed: {
            userTimeZone: function () {
                let timeValue = (new Date().getTimezoneOffset() / 60) * (-1);
                return timeValue >= 0 ? '+' + timeValue.toString() : timeValue.toString();
            },
        },
        beforeRouteEnter(to, from, next) {
            //none
            next(vm => {
                cancel();
                vm.routeCase(to)
                vm.update()
                next()
            })
        },
        beforeRouteUpdate(to, from, next) {
          this.load.timeline = true
          this.routeCase(to)
            this.update()
            next()
        },
        watch: {
          //"tweetStatus.displayType": {
          //    handler: function () {
          //        //暴力处理
          //        if (this.ready) {
          //            window.stop();
          //        }
          //    },
          //    deep: true
          //},
          //"tweetStatus.display": {
          //    handler: function () {
          //        //暴力处理
          //        if (this.ready) {
          //            window.stop();
          //        }
          //    },
          //    deep: true
          //},
          "name": function () {
            this.chart.rows = [];
            this.getUserInfo(this.name);
          },
          "info": function () {
            //バンドリ！ BanG Dream! 公式 (@bang_dream_info) / Twitter
            this.$root.title = this.info.display_name ? this.info.display_name + ' (@' + this.info.name + ') / Twitter Monitor' : "Twitter Monitor";
            //隐藏帐号
            if (!this.$root.userList.map(x => x.name).includes(this.info.name)) {
              this.hidden = true
                this.update()
              }
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
                handler: function () {
                    this.search.keywords = '';
                },
                deep: true,
            }
        },
        mounted: function () {
          new CancelToken(c => cancel = c);//提前生成
          //处理路由
          //check $route
          if (this.$root.names.length === 0 || this.$root.languageList.length === 0) {
            let startTime = Date.now();
            axios.all([this.getAccountList(), this.getLanguageList()]).then(axios.spread((accountList, languageList) => {
              this.$root.languageList = languageList.data;
              this.$root.names = accountList.data.data.account_info;
              this.$root.projects = accountList.data.data.projects;
              this.$root.links = accountList.data.data.links;
              this.$root.settings.adminStatus = !!accountList.data.whiteIP
              //处理网速
                  if (Date.now() - startTime > 3000) {
                    this.$root.settings.data.displayPicture = true;
                    this.notice('当前网速较慢，已关闭图片显示', 'warning');
                  }
                })).catch(error => {
                    this.notice(error, 'error');
                });
            }
        },
        methods: {
            getAccountList: function () {
              return axios.get(this.basePath + "/api/v2/data/accounts/");
            },
            getLanguageList: function () {
                return axios.get(this.basePath + (process.env.NODE_ENV !== "development" ? "/language_target.json" : "/proxy.php?filename=language_target"));
            },
            loading: function (type = 0) {
                if (this.tweetStatus.bottomTweetId && this.tweetStatus.topTweetId) {
                    //0 -> top, 1 -> bottom
                    this.load[(type === 0 ? 'top' : 'bottom')] = true;
                  axios.get(this.mergeUrl() + (type === 0 ? '&refresh=1&tweet_id=' + this.tweetStatus.topTweetId.toString() : '&refresh=0&tweet_id=' + this.tweetStatus.bottomTweetId.toString() + (this.hidden ? '&hidden=1' : '')), {
                    cancelToken: new CancelToken(c => cancel = c)
                  }).then(response => {
                        if (type === 0) {
                          this.notice("已更新" + response.data.data.tweets.length + "条推文", "success");
                          //this.getUserInfo();
                          if (response.data.data.top_tweet_id) {
                            this.tweetStatus.topTweetId = response.data.data.top_tweet_id;
                          }
                          this.$root.tweets = [...response.data.data.tweets, ...this.$root.tweets];
                          if (this.chart.generate) {
                            this.createChart(this.chart.latestTimestamp, true)
                          }
                          this.load.top = false;
                        } else {
                            this.tweetStatus.moreTweets = response.data.data.hasmore;
                            if (response.data.data.bottom_tweet_id) {
                                this.tweetStatus.bottomTweetId = response.data.data.bottom_tweet_id;
                            }
                          this.$root.tweets.push(...response.data.data.tweets);
                          this.load.bottom = false;
                        }
                    }).catch(error => {
                        if (error.toString() !== 'Cancel') {
                            this.notice(error, "error")
                        }
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
                      this.chart.legendName = {
                        '关注者': '关注者 ' + this.info.followers,
                        '正在关注': '正在关注 ' + this.info.following,
                        '总推文数': '总推文数 ' + this.info.statuses_count
                      };
                        this.createChart();
                    } else {
                      this.notice(response.data.message, "error");
                      this.chart.legendName = {'关注者': '关注者', '正在关注': '正在关注', '总推文数': '总推文数'};
                      this.tweetStatus.userExist = false;
                    }
                  this.load.leftCard = false;
                }).catch(error => {
                  if (error.toString() !== 'Cancel') {
                    this.notice(error, "error")
                  }
                  //this.load.leftCard = false;
                });
            },
          createChart: function (time = 0, refresh = false) {
            axios.get(this.basePath + '/api/v2/data/chart/?uid=' + this.info.uid + (time > 0 ? '&end=' + time : '') + (refresh ? '&refresh=1' : '')).then(response => {
              if (response.data.data.length) {
                this.chart.latestTimestamp = response.data.data.slice(-1)[0].timestamp
              }
              let tmpRows = response.data.data.map(x => {
                x.timestamp = (new Date(x.timestamp * 1000)).toLocaleString(this.$root.settings.data.language)
                return x
              })
              this.chart.rows = refresh ? [...this.chart.rows, ...tmpRows] : tmpRows
              if (!this.chart.rows.length && !refresh) {
                this.chart.generate = false
                //this.notice("chart: " + response.data.message, "warning");
              }
            }).catch(error => {
              if (this.tweetStatus.displayType === "timeline" && error.toString() !== 'Cancel') {
                this.notice('图表加载失败 #' + error, 'error');
                setTimeout(() => {
                  this.createChart(time, refresh)
                }, 5000);
              }
            });
            },
            update: function () {
              axios.get(this.mergeUrl() + (this.hidden ? '&hidden=1' : ''), {
                cancelToken: new CancelToken(c => cancel = c)
              }).then(response => {
                  this.$root.tweets = response.data.data.tweets ? response.data.data.tweets : [];//404时无任何数据
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
                    url += '?name=' + this.name + '&date=' + Date.parse(this.search.keywords + ' GMT' + this.userTimeZone) / 1000;
                } else if (this.search.keywords && this.tweetStatus.displayType === 'search') {
                    url += '?q=' + encodeURIComponent(this.search.keywords);
                }
                //二层
                else if (this.tweetStatus.displayType === 'timeline') {
                    url += '?name=' + this.name + '&display=' + this.tweetStatus.display;
                }
                //status
                else if (this.tweetStatus.displayType === 'status') {
                    url += '?name=' + this.name + '&is_status=1&tweet_id=' + this.tweetStatus.statusId;
                }
                return url;
            },
            routeCase: function (to = this.$route) {
                this.$root.home = false;
                //name
                if (to.params.name && to.params.name !== 'search') {
                    this.name = to.params.name;
                    this.tweetStatus.displayType = 'timeline';
                    //display
                    if (to.params.display) {
                        switch (to.params.display.toLowerCase()) {
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
                    } else if (to.params.status) {
                        //status
                        this.tweetStatus.displayType = 'status';
                        this.tweetStatus.statusId = to.params.status;
                    } else {
                        this.$router.replace({path: '/' + this.name + '/all/'});
                    }
                } else if (to.params.name === 'search') {
                    this.search.keywords = to.params.search;
                    this.load.leftCard = false;
                    this.tweetStatus.displayType = 'search';
                }
                //hashtag & cashtag
                if (to.params.hashtag || to.params.cashtag) {
                    this.tag.text = to.params.hashtag ? to.params.hashtag : to.params.cashtag;
                    this.tag.type = to.params.hashtag ? 0 : 1;
                    this.tweetStatus.displayType = 'tag';
                    this.load.leftCard = false;
                }
                //search
                if (to.params.search) {
                    this.search.keywords = to.params.search;
                    this.load.leftCard = false;
                    this.tweetStatus.displayType = 'search';
                }
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
