<template>
    <div id="timeLine">
        <navigation :display-type="tweetStatus.displayType"/>
        <div class="my-4"></div>
        <main class="container" id="main" role="main">
            <div class="row">
                <div :class="{'col-sm-12': true, 'col-md-4': tweetStatus.displayType !== 'search', 'col-md-3': tweetStatus.displayType === 'search'}">
                  <div :style="{'position': 'sticky', 'top': '1.5rem',}">
                      <template v-if="tweetStatus.userExist">
                        <el-skeleton :loading="load.leftCard" animated>
                          <div class="card">
                            <template>
                              <el-collapse-transition>
                                <div v-show="($root.width < 768 || $root.height === 0)" class="row no-gutters">
                                  <el-image
                                        v-if="!$root.settings.data.displayPicture && info.banner !== 0 && tweetStatus.displayType !== 'search' && tweetStatus.displayType !== 'tag'"
                                        :preview-src-list="[mediaPath+(mediaPath === basePath ? `/api/v2/media/userinfo/` : '')+`pbs.twimg.com/profile_banners/`+info.uid_str+`/`+info.banner+`.banner`]"
                                        :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/userinfo/` : '')+`pbs.twimg.com/profile_banners/`+info.uid_str+`/`+info.banner+`.banner`" alt="Banner" class="col-12 card-img-top"
                                        fit="cover"
                                        style="max-height: 20vh"></el-image>
                                </div>
                              </el-collapse-transition>
                              <div class="card-body">
                                <h3 v-if="tweetStatus.displayType === 'search'">{{ $t("public.search") }}</h3>
                                <template v-else-if="tweetStatus.displayType === 'tag'">
                                  <h3>
                                    <router-link :to="tag.text">{{ (tag.type === 0 ? '#' : '1') + tag.text }}</router-link>
                                    <a :href="`https://twitter.com/search?q=`+ encodeURIComponent((tag.type === 0 ? '#' : '$') + tag.text)" target="_blank">
                                      <box-arrow-up-right height="1em" status="text-primary" width="1em"/>
                                    </a>
                                  </h3>
                                </template>
                                <div v-else class="container">
                                  <div class="row">
                                    <div class="col-12 text-right">
                                      <verified v-if="info.verified" height="1.2em" status="text-primary"
                                                width="1.2em"/>
                                      <deleted v-if="info.deleted" height="1.2em" status="text-danger"
                                               width="1.2em"/>
                                      <locked v-else-if="info.locked" height="1.2em" status="text-danger"
                                              width="1.2em"/>
                                    </div>
                                    <div :class="{'col-4': !$root.settings.data.displayPicture}" style="max-height: 100px; max-width: 100px">
                                      <el-image
                                          v-if="!$root.settings.data.displayPicture && info.header"
                                          :preview-src-list="[mediaPath+(mediaPath === basePath ? `/api/v2/media/userinfo/` : '')+info.header]"
                                          :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/userinfo/` : '')+info.header.replace(/([\w]+)\.([\w]+)$/gm, `$1_bigger.$2`)" class="rounded-circle img-fluid" lazy>
                                        <div slot="error" class="image-slot">
                                          <el-skeleton :paragraph="false" :title="false" animated >
                                            <template slot="template">
                                              <el-skeleton-item style="height: 50px; width: 50px" variant="circle" />
                                            </template>
                                          </el-skeleton>
                                        </div>
                                        <div slot="placeholder" class="image-slot">
                                          <el-skeleton :paragraph="false" :title="false" animated >
                                            <template slot="template">
                                              <el-skeleton-item style="height: 50px; width: 50px" variant="circle" />
                                            </template>
                                          </el-skeleton>
                                        </div>
                                      </el-image>
                                      <div class="my-4"></div>
                                    </div>
                                    <div :class="{'col-8': !$root.settings.data.displayPicture, 'col-12': $root.settings.data.displayPicture}">
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
                                  <el-collapse-transition>
                                    <div v-show="($root.width < 768 || $root.height < 700)">
                                      <html-text class="transition-box" :full_text_origin="info.description_origin" :entities="info.description_entities"></html-text>
                                      <translate :id="info.uid_str" :to="$root.settings.data.language" :type="1" class="transition-box"/>
                                    </div>
                                  </el-collapse-transition>
                                </div>
                              </div>
                            </template>
                          </div>
                        </el-skeleton>
                        <template v-if="tweetStatus.displayType === 'timeline'">
                          <!--Load data-->
                          <div class="my-4"></div>
                          <el-skeleton :loading="!chart.rows.length" :rows="4" anmiated
                                       v-if="chart.rows && chart.generate">
                            <tmv2-chart :chart-height="chart.chartHeight" :chart-rows="chart.rows"
                                        :grid="{left: '18%', right: '18%'}" :label-map="chart.labelMap" :legend-not-selected="chart.legendNotSelected"
                                        :y-axis="chart.yAxis" :y-axis-index="chart.yAxisIndex" chart-type="line"></tmv2-chart>
                          </el-skeleton>
                          <el-table v-else
                                    :data="[{followers: info.followers, following: info.following, statuses_count: info.statuses_count}]"
                                    style="width: 100%">
                            <el-table-column :label="$t('public.followers')" prop="followers"></el-table-column>
                            <el-table-column :label="$t('public.following')" prop="following"></el-table-column>
                            <el-table-column :label="$t('public.statuses_count')" prop="statuses_count"></el-table-column>
                          </el-table>
                        </template>
                        <div class="my-4">
                        </div>
                      </template>
                    </div>
                </div>
              <div :class="{'col-sm-12': true, 'col-md-6': tweetStatus.displayType !== 'search', 'col-md-7': tweetStatus.displayType === 'search'}">
                <div v-if="!tweetStatus.userExist">
                  <h5 class="mx-auto">{{ $t("timeline.message.not_exist", [name]) }}</h5>
                  <div class="my-4"></div>
                </div>
                <template v-else>
                    <search :display-type="tweetStatus.displayType" :name="name" :search="search"/>
                    <div class="my-4"></div>
                    <nav :style="{'position': 'sticky', 'top': '1.5rem', 'z-index': 1, 'background-color': 'rgba(255, 255, 255, 0.9)', 'border-radius': '0.25rem'}" class="nav nav-pills nav-fill border">
                      <template v-if="tweetStatus.displayType === 'timeline' && !load.leftCard">
                        <li v-for="(value, s) in displayMode" :key="s" class="nav-item">
                          <div v-if="value[1] === tweetStatus.display" class="nav-link active" role="button"
                               @click="loading( 0)">{{ value[0] }}
                          </div>
                          <router-link v-else :to="`/`+info.name+`/`+value[1]" class="nav-link">{{ value[0]
                            }}
                          </router-link>
                        </li>
                      </template>
                      <li class="nav-item">
                        <div
                            :class="{'nav-link': true, 'active': $root.settings.data.displayPicture, 'text-primary': !$root.settings.data.displayPicture}"
                            role="button"
                            @click="$root.settings.data.displayPicture=!$root.settings.data.displayPicture">{{ $t("timeline.nav_bar.no_image") }}
                        </div>
                      </li>
                    </nav>
                  <hr class="my-4">
                  <!--user tweets-->
                  <el-skeleton :loading="load.timeline" :rows="5" animated>
                    <div >
                      <template
                          v-if="tweetStatus.displayType === 'timeline' && (info.deleted || info.locked)">
                        <div class="card card-border border-info" id="alertMsg">
                          <div class='card-body'>
                            {{ info.deleted ? $t("timeline.message.no_longer_monitor_deleted") : $t("timeline.message.no_longer_monitor_protected") }}
                          </div>
                        </div>
                        <hr class="my-4">
                      </template>
                      <div class="text-center" v-if="tweetStatus.reload">
                        <el-button @click="() => {load.timeline=true;update()}" icon="el-icon-refresh-left"
                                   round>{{ $t("public.retry") }}
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
                            <span>{{ $t("timeline.message.load_more") }}</span>
                          </button>
                          <el-skeleton :rows="1" animated
                                       v-else-if="tweetStatus.moreTweets && load.bottom"/>
                          <div v-else-if="!(tweetStatus.displayType === 'status')">
                            <h5 class="text-center">{{ $t("timeline.message.no_more") }}</h5>
                          </div>
                        </template>
                      </div>
                      <div v-else-if="!tweetStatus.reload">
                        <h5 class="text-center">{{ $t("timeline.message.no_more") }}</h5>
                      </div>
                    </div>
                  </el-skeleton>
                  <div class="my-4"></div>
                    </template>
                </div>
              <div class="col-sm-12 col-md-2">
                <div :style="{'position': 'sticky', 'top': '1.5rem'}">
                  <project-list/>
                  <div class="mb-1 col-10" style="padding-left: 0;">
                    <span class="text-decoration-none badge badge-pill badge-primary mx-1"
                          role="button" @click="$root.settings.panel = true">{{ $t("timeline.side_tags.settings") }}</span>
                    <span is="router-link" class="text-decoration-none badge badge-pill badge-primary mx-1"
                          to="/about">{{ $t("timeline.side_tags.about") }}</span>
                    <span is="router-link" class="text-decoration-none badge badge-pill badge-primary mx-1"
                          to="/i/stats">{{ $t("timeline.side_tags.stats") }}</span>
                    <span is="router-link" class="text-decoration-none badge badge-pill badge-primary mx-1"
                          to="/i/status">{{ $t("timeline.side_tags.status") }}</span>
                    <span is="router-link" class="text-decoration-none badge badge-pill badge-primary mx-1"
                          to="/api">{{ $t("timeline.side_tags.api") }}</span>
                    <span is="router-link" class="text-decoration-none badge badge-pill badge-primary mx-1"
                          to="/i/online">{{ $t("timeline.side_tags.media_download_tool") }}</span>
                    <span is="a"
                          v-if="!hidden && (tweetStatus.displayType === 'timeline' || tweetStatus.displayType === 'status')" :href="basePath + `/api/v2/rss/` + info.name + `.xml`"
                          class="text-decoration-none badge badge-pill badge-primary mx-1">{{ $t("timeline.side_tags.rss") }}</span>
                    <span is="router-link" v-if="$root.settings.adminStatus"
                          class="text-decoration-none badge badge-pill badge-dark mx-1"
                          to="/i/admin">{{ $t("timeline.side_tags.backstage") }}</span>
                  </div>
                  <hr class="my-4">
                  <link-list/>
                </div>
              </div>
            </div>
          <!--setting-->
          <settings/>
          <transition name="el-fade-in">
            <div v-if="tweetStatus.displayType !== 'status'" class="el-backtop" style="right: 40px; bottom: 90px"
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
    import BoxArrowUpRight from "@/components/icons/boxArrowUpRight";
    import HtmlText from "@/components/modules/htmlText";

    const CancelToken = axios.CancelToken;
    let cancel;
    export default {
        name: 'App',
        components: {
          HtmlText,
          BoxArrowUpRight,
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
                mode: 0,//0->keywords, 1->date, 2->advanced
                advancedSearch: {
                  user: {
                    "text": "",
                    "andMode": 0,
                    "notMode": 0,
                  },
                  keywords: {
                    "text": "",
                    "orMode": 0,
                    "notMode": 0,
                  },
                  tweetType: {
                    type: 0,//0-> all, 1-> origin, 2-> retweet
                    media: 0,//media
                  },
                  start: "",
                  end: "",
                  order: 0,//正序0, 倒序1
                  hidden: 0,
                }
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
                displayMode: [[this.$t("timeline.nav_bar.all"), 'all', 0], [this.$t("timeline.nav_bar.origin"), 'self', 0], [this.$t("timeline.nav_bar.retweet"), 'retweet', 0], [this.$t("timeline.nav_bar.media"), 'media', 0]],
                chart: {
                  generate: true,
                  latestTimestamp: 0,
                  chartHeight: "250px",
                  rows: [],
                  labelMap: {
                    timestamp: this.$t("timeline.scripts.time"),
                    followers: this.$t("public.followers"),
                    following: this.$t("public.following"),
                    statuses_count: this.$t("public.statuses_count"),
                  },
                  legendName: {},
                  yAxisIndex: [0, 0, 1],
                  yAxis: [{type: 'value', scale: true, minInterval: 1}, {type: 'value', scale: true, minInterval: 1}],
                  legendNotSelected: [1],
                },
              //leftDomHeight: 0,
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
          cancel();
          this.load.timeline = true
          this.routeCase(to)
          this.update()
          next()
        },
        watch: {
          "tweetStatus.displayType": {
              handler: function () {
                  //暴力处理
                  if (this.tweetStatus.displayType !== 'search' && this.search.mode === 2) {
                      this.search.mode = 0
                  }
              },
              deep: true
          },
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
            //已放开隐藏账号
            //if (this.$root.userList.length !== 0 && !this.$root.userList.map(x => x.name).includes(this.info.name)) {
            //  this.hidden = true
            //  this.update()
            //}
            //this.display_name = this.info.display_name;
          },
            "search.keywords": {
                handler: function () {
                    if (this.search.mode === 1 && this.tweetStatus.displayType !== 'userSelector') {
                        this.tweetStatus.displayType = 'timeline'
                        //this.$router.replace('../../all')
                        cancel()
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
            },
          "search.advancedSearch": {
            handler: function () {
              this.tweetStatus.topTweetId = 0
              this.tweetStatus.bottomTweetId = 0
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
                this.notice(this.$t("timeline.scripts.message.internet_speed_is_too_slow_now_image_display_has_been_turned_off"), 'warning');
              }
              //处理隐藏
              if (this.$root.userList.length !== 0 && !this.$root.userList.map(x => x.name).includes(this.info.name)) {
                this.update()
              }
            })).catch(error => {
                    this.notice(error, 'error');
                });
            }
          //this.updateLeftDomHeight()
        },
        methods: {
            getAccountList: function () {
              return axios.get(this.basePath + "/api/v2/data/accounts/");
            },
            getLanguageList: function () {
                return axios.get(this.basePath + (process.env.NODE_ENV !== "development" ? "/language_target.json" : "/proxy.php?filename=language_target"));
            },
            autoLoadButtom: function () {
              this.loading(1)
            },
            loading: function (type = 0) {
                if (this.tweetStatus.bottomTweetId && this.tweetStatus.topTweetId) {
                    //0 -> top, 1 -> bottom
                    this.load[(type === 0 ? 'top' : 'bottom')] = true;
                  axios.get(this.mergeUrl() + (type === 0 ? '&refresh=1&tweet_id=' + this.tweetStatus.topTweetId.toString() : '&refresh=0&tweet_id=' + this.tweetStatus.bottomTweetId.toString() + (this.hidden ? '&hidden=1' : '')), {
                    cancelToken: new CancelToken(c => cancel = c)
                  }).then(response => {
                        if (type === 0) {
                          this.notice(this.$t("timeline.scripts.message.update_tweets", [response.data.data.tweets.length]), "success");
                          //this.getUserInfo();
                          if (response.data.data.top_tweet_id && response.data.data.top_tweet_id !== "0") {
                            this.tweetStatus.topTweetId = response.data.data.top_tweet_id;
                          }
                          this.$root.tweets = [...response.data.data.tweets, ...this.$root.tweets];
                          if (this.chart.generate && this.tweetStatus.displayType === 'timeline') {
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
                    this.notice(this.$t("timeline.scripts.message.missing_parameter"), "error");
                }
            },
            getUserInfo: function (name) {
                this.load.leftCard = true;
                axios.get(this.basePath + '/api/v2/data/userinfo/?name=' + name, {
                    cancelToken: new CancelToken(c => cancel = c)
                }).then(response => {
                    this.info = response.data.data;
                    if (response.data.code === 200) {
                      //this.chart.legendName = {
                      //  '关注者': '关注者 ' + this.info.followers,
                      //  '正在关注': '正在关注 ' + this.info.following,
                      //  '总推文数': '总推文数 ' + this.info.statuses_count
                      //};
                        this.createChart();
                    } else {
                      this.notice(response.data.message, "error");
                      //this.chart.legendName = {'关注者': '关注者', '正在关注': '正在关注', '总推文数': '总推文数'};
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
            axios.get(this.basePath + '/api/v2/data/chart/?uid=' + this.info.uid_str + (time > 0 ? '&end=' + time : '') + (refresh ? '&refresh=1' : '')).then(response => {
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
                this.notice(this.$t("timeline.scripts.message.failed_to_generate_chart", [error]), 'error');
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
                  if (response.data.data.top_tweet_id !== "0") {
                    this.tweetStatus.topTweetId = response.data.data.top_tweet_id;
                  }
                  if (response.data.data.bottom_tweet_id !== "0") {
                    this.tweetStatus.bottomTweetId = response.data.data.bottom_tweet_id;
                  }
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

                //queryLink
                let queryStringObject = new URLSearchParams()
                //date
                if (this.search.mode === 1 && this.search.keywords && (this.tweetStatus.displayType === 'search' || this.tweetStatus.displayType === 'timeline')) {
                  queryStringObject.set('name', this.name)
                  queryStringObject.set('date', (Date.parse(this.search.keywords + ' GMT' + this.$root.userTimeZone) / 1000))
                } else if (this.tweetStatus.displayType === 'search' && this.search) {
                    if (this.search.mode === 2) {
                      queryStringObject.set('q', this.search.advancedSearch.keywords.text)
                      queryStringObject.set('text_or_mode', (this.search.advancedSearch.keywords.orMode ? '1' : '0'))
                      queryStringObject.set('text_not_mode', (this.search.advancedSearch.keywords.notMode ? '1' : '0'))
                      queryStringObject.set('user', this.search.advancedSearch.user.text)
                      queryStringObject.set('user_and_mode', (this.search.advancedSearch.user.andMode ? '1' : '0'))
                      queryStringObject.set('user_not_mode', (this.search.advancedSearch.user.notMode ? '1' : '0'))
                      queryStringObject.set('tweet_type', this.search.advancedSearch.tweetType.type.toString())
                      queryStringObject.set('tweet_media', (this.search.advancedSearch.tweetType.media ? '1' : '0'))
                      queryStringObject.set('start', (this.search.advancedSearch.start === "" ? -1 : Date.parse(this.search.advancedSearch.start + ' GMT' + this.$root.userTimeZone) / 1000).toString())
                      queryStringObject.set('end', (this.search.advancedSearch.end === "" ? -1 : Date.parse(this.search.advancedSearch.end + ' GMT' + this.$root.userTimeZone) / 1000).toString())
                      queryStringObject.set('order', this.search.advancedSearch.order)
                      queryStringObject.set('advanced', 1)
                      if (this.$root.settings.adminStatus) {
                        queryStringObject.set('hidden', this.search.advancedSearch.hidden)
                      }
                    } else if (this.search.keywords) {
                      queryStringObject.set('q', this.search.keywords)
                    }
                }
                //二层
                else if (this.tweetStatus.displayType === 'timeline') {
                  queryStringObject.set('name', this.name)
                  queryStringObject.set('display', this.tweetStatus.display)
                }
                //status
                else if (this.tweetStatus.displayType === 'status') {
                  queryStringObject.set('name', this.name)
                  queryStringObject.set('is_status', 1)
                  queryStringObject.set('tweet_id', this.tweetStatus.statusId)
                }
                let queryString = queryStringObject.toString()
                return url + (queryString ? ('?' + queryString) : '');
            },
            routeCase: function (to = this.$route) {
                this.$root.home = false;
                this.load.timeline = true;
                //name
                if (to.params.name && !RegExp('^/search').test(to.path)) {
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
                }
                //hashtag & cashtag
                if (to.params.hashtag || to.params.cashtag) {
                    this.tag.text = to.params.hashtag ? to.params.hashtag : to.params.cashtag;
                    this.tag.type = to.params.hashtag ? 0 : 1;
                    this.tweetStatus.displayType = 'tag';
                    this.load.leftCard = false;
                }
                //search
                if (RegExp('^/search').test(to.path)) {
                    this.search.keywords = to.query.q ? to.query.q : to.params.search ? to.params.search : '';
                    //advancedSearch
                    if (to.query.advanced === '1') {
                      this.search.mode = 2
                      this.search.advancedSearch = {
                        user: {
                          "text": to.query.user,
                          "andMode": to.query.user_and_mode !== '0',
                          "notMode": to.query.user_not_mode !== '0',
                        },
                        keywords: {
                          "text": to.query.q,
                          "orMode": to.query.text_or_mode !== '0',
                          "notMode": to.query.text_not_mode !== '0',
                        },
                        tweetType: {
                          type: (to.query.text_or_mode && to.query.text_or_mode > -1 && to.query.text_or_mode < 3) ? Number(to.query.tweet_type) : 0,//0-> all, 1-> origin, 2-> retweet
                          media: to.query.text_or_mode !== '0',//media
                        },
                        start: to.query.start,
                        end: to.query.end,
                        order: to.query.order,//正序0, 倒序1
                        hidden: to.query.hidden ? '1' : '0',
                      }
                    }
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
          //updateLeftDomHeight: function () {
          //  this.leftDomHeight = document.getElementById("leftDom").offsetTop
          //  setTimeout(() => {
          //    this.updateLeftDomHeight();
          //  }, 500);
          //}
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
