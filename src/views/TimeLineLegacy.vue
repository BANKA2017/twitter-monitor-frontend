<template>
  <div id="timeLine">
    <navigation :display-type="tweetStatus.displayType"/>
    <div class="container mt-8" id="main" role="main">
      <div class="row">
        <div id="left-card" :class="{'col-sm-12': true, 'col-md-4': tweetStatus.displayType !== 'search', 'col-md-3': tweetStatus.displayType === 'search'}">
          <div :style="{'position': 'sticky', 'top': '1.5rem', 'z-index': 1000}">
                      <template v-if="tweetStatus.userExist">
                        <el-skeleton :loading="load.leftCard" animated>
                          <div class="card">
                            <el-collapse-transition>
                              <div v-show="(width < 768 || height === 0)" class="row no-gutters">
                                <el-image
                                      v-if="!settings.displayPicture && info.banner !== 0 && tweetStatus.displayType !== 'search' && tweetStatus.displayType !== 'tag'"
                                      :preview-src-list="[createRealMediaPath('userinfo')+`pbs.twimg.com/profile_banners/`+info.uid_str+`/`+info.banner+`.banner`]"
                                      :src="createRealMediaPath('userinfo')+`pbs.twimg.com/profile_banners/`+info.uid_str+`/`+info.banner+`.banner`" alt="Banner" class="col-12 card-img-top"
                                      fit="cover"
                                      lazy style="max-height: 20vh; z-index: 5000"></el-image>
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
                                    <verified v-if="info.verified" height="1.2em" status="text-primary" width="1.2em"/>
                                    <deleted v-if="info.deleted" height="1.2em" status="text-danger" width="1.2em"/>
                                    <locked v-else-if="info.locked" height="1.2em" status="text-danger" width="1.2em"/>
                                  </div>
                                  <div :class="{'col-4': !settings.displayPicture}" style="max-height: 100px; max-width: 100px">
                                    <el-image
                                        v-if="!settings.displayPicture && info.header"
                                        :preview-src-list="[createRealMediaPath('userinfo')+info.header]"
                                        style="z-index: 5000"
                                        :src="createRealMediaPath('userinfo')+info.header.replace(/([\w]+)\.([\w]+)$/gm, `$1_bigger.$2`)" class="rounded-circle img-fluid" lazy>
                                      <template #error>
                                        <div class="image-slot">
                                          <el-skeleton :paragraph="false" :title="false" animated >
                                            <template #template>
                                              <el-skeleton-item style="height: 50px; width: 50px" variant="circle" />
                                            </template>
                                          </el-skeleton>
                                        </div>
                                      </template>
                                      <template #placeholder>
                                        <div class="image-slot">
                                          <el-skeleton :paragraph="false" :title="false" animated >
                                            <template #template>
                                              <el-skeleton-item style="height: 50px; width: 50px" variant="circle" />
                                            </template>
                                          </el-skeleton>
                                        </div>
                                      </template>
                                    </el-image>
                                    <div class="my-4"></div>
                                  </div>
                                  <div :class="{'col-8': !settings.displayPicture, 'col-12': settings.displayPicture}">
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
                                  <div v-show="(width < 768 || height < 700)">
                                    <html-text :entities="info.description_entities" :full_text_origin="info.description_origin" class="transition-box"></html-text>
                                    <translate v-if="info.description_origin" :id="info.uid_str" :to="settings.language" :type="1" class="transition-box"/>
                                  </div>
                                </el-collapse-transition>
                              </div>
                            </div>
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
                    <search :display-type="tweetStatus.displayType" :name="name" :search-props="search"/>
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
                            :class="{'nav-link': true, 'active': settings.displayPicture, 'text-primary': !settings.displayPicture}"
                            role="button"
                            @click="swapDisplayPictureStatus">{{ $t("timeline.nav_bar.no_image") }}
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
                        <el-button round
                                   @click="() => {load.timeline=true;update()}"><arrow-clockwise height="1em" status="" width="1em" />{{ $t("public.retry") }}
                        </el-button>
                      </div>
                      <div class="text-center" element-loading-background="rgba(255, 255, 0, 0)"
                           style="height: 60px" v-if="load.top" v-loading="load.top"></div>
                      <div v-if="!tweetStatus.reload && tweets.length">
                        <div v-for="(tweet, order) in tweets" :key="order">
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
                        <button v-if="tweetStatus.moreTweets && !load.bottom" class="btn btn-primary btn-lg btn-block"
                                type="button" @click="loading(1)">
                          <span>{{ $t("timeline.message.load_more") }}</span>
                        </button>
                        <el-skeleton v-else-if="tweetStatus.moreTweets && load.bottom" :rows="1"
                                     animated/>
                        <div v-else-if="!(tweetStatus.displayType === 'status')">
                          <h5 class="text-center">{{ $t("timeline.message.no_more") }}</h5>
                        </div>
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
                    <router-link is="span" class="text-decoration-none badge badge-pill badge-primary mx-1"
                          to="/settings" >{{ $t("timeline.side_tags.settings") }}</router-link>
                    <router-link is="span" class="text-decoration-none badge badge-pill badge-primary mx-1"
                          to="/about">{{ $t("timeline.side_tags.about") }}</router-link>
                    <router-link is="span" class="text-decoration-none badge badge-pill badge-primary mx-1"
                          to="/i/stats">{{ $t("timeline.side_tags.stats") }}</router-link>
                    <router-link is="span" class="text-decoration-none badge badge-pill badge-primary mx-1"
                          to="/i/status">{{ $t("timeline.side_tags.status") }}</router-link>
                    <router-link is="span" class="text-decoration-none badge badge-pill badge-primary mx-1"
                          to="/api">{{ $t("timeline.side_tags.api") }}</router-link>
                    <router-link is="span" class="text-decoration-none badge badge-pill badge-primary mx-1"
                          to="/i/online">{{ $t("timeline.side_tags.media_download_tool") }}</router-link>
                    <a :href="settings.basePath + `/api/v2/rss/` + info.name + `.xml`" target="_blank"><span
                          v-if="!hidden && (tweetStatus.displayType === 'timeline' || tweetStatus.displayType === 'status')"
                          class="text-decoration-none text-white badge badge-pill badge-primary mx-1">{{ $t("timeline.side_tags.rss") }}</span></a>
                    <!--<router-link is="span" v-if="settings.adminStatus"
                          class="text-decoration-none badge badge-pill badge-dark mx-1"
                          to="/i/admin">{{ $t("timeline.side_tags.backstage") }}</router-link>-->
                  </div>
                  <hr class="my-4">
                  <link-list/>
                </div>
              </div>
            </div>
          <!--settings become a single page-->
          <!--<settings/>-->
          <transition name="el-fade-in">
            <div v-if="tweetStatus.displayType !== 'status'" class="el-backtop" style="right: 40px; bottom: 90px; z-index: 1500"
                 @click="()=>{scrollToTop();loading(0)}">
              <arrow-clockwise height="1em" status="" width="1em" />
            </div>
          </transition>
        </div>
    </div>

</template>

<script>
    import translate from "@/components/modules/translate.vue";
    import Verified from "@/icons/Verified.vue";
    import Deleted from "@/icons/Deleted.vue";
    import Locked from "@/icons/Locked.vue";
    import Search from "@/components/modules/search.vue";
    import Tweet from "@/components/modules/tweet.vue";
    import Navigation from "@/components/Navigation.vue";
    import ProjectList from "@/components/modules/projectList.vue";
    import LinkList from "@/components/modules/linkList.vue";
    import Tmv2Chart from "@/components/modules/tmv2Chart.vue";
    import HtmlText from "@/components/FullText.tsx";
    import {mapState} from "vuex";
    import {useStore} from "../store";
    import {computed, inject} from "vue";
    import {useHead} from "@vueuse/head";
    import BoxArrowUpRight from "@/icons/BoxArrowUpRight.vue";
    import ArrowClockwise from "@/icons/ArrowClockwise.vue";

    export default {
        name: 'timeLine',
        setup () {
          const store = useStore()
          useHead({
            title: computed(() => store.state.title),
            htmlAttrs: {
              lang: computed(() => store.state.settings.language)
            }
          })
          const scrollToTop = inject('scrollToTop')
          const notice = inject('notice')
          let controller = {
            infoSignal: [new AbortController()],
            updateTweetsSignal: [new AbortController()],
            refreshTweetsSignal: [new AbortController()],
          }
          return {
            scrollToTop,
            notice,
            controller,
          }
        },
        components: {
          ArrowClockwise,
          BoxArrowUpRight,
          HtmlText,
          Tmv2Chart,
          LinkList,
          ProjectList,
          Navigation,
          Tweet,
          Search,
          Locked,
          Deleted,
          Verified,
          translate
        },
        data() {
            return {
                displayName: "Twitter",
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
                displayMode: [
                  [this.$t("timeline.nav_bar.all"), 'all', 0],
                  [this.$t("timeline.nav_bar.origin"), 'self', 0],
                  [this.$t("timeline.nav_bar.retweet"), 'retweet', 0],
                  [this.$t("timeline.nav_bar.media"), 'media', 0]
                ],
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
        beforeRouteEnter(to, from, next) {
            //none
            next(vm => {
                vm.cancelAll()
                vm.routeCase(to)
                vm.update()
            })
        },
        beforeRouteUpdate(to) {
          this.cancelAll()
          this.load.timeline = true
          this.routeCase(to)
          this.update()
        },
      computed: mapState({
          now: 'now',
          settings: 'settings',
          height: 'height',
          width: 'width',
          realMediaPath: 'realMediaPath',
          samePath: 'samePath',
          tweets: 'tweets',
          names: 'names',
          userTimeZone: 'userTimeZone',
          title: 'title',
          userList: 'userList',
        }),
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
            this.$store.dispatch({
              type: 'setCoreValue',
              key: 'title',
              value: this.info.display_name ? this.info.display_name + ' (@' + this.info.name + ') / Twitter Monitor' : "Twitter Monitor"
            })
          },
            "search.keywords": {
                handler: function () {
                    if (this.search.mode === 1 && this.tweetStatus.displayType !== 'userSelector') {
                        this.tweetStatus.displayType = 'timeline'
                        //this.$router.replace('../../all')
                        this.cancelAll()
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
          //处理路由
          //check $route
          if (this.names.length === 0) {
            let startTime = this.now;
            fetch(this.settings.basePath + "/api/v2/data/accounts/").then(async accountList => {
              accountList = await accountList.json()
              this.$store.dispatch({
                type: 'setCoreValue',
                key: 'names',
                value: accountList.data.account_info
              })
              this.$store.dispatch({
                type: 'setCoreValue',
                key: 'projects',
                value: accountList.data.projects
              })
              this.$store.dispatch({
                type: 'setCoreValue',
                key: 'links',
                value: accountList.data.links
              })
              //处理网速
              if (this.now - startTime > 3000) {
                this.$store.dispatch({
                  type: 'updateDisplayPictureStatus',
                  status: true
                })
                this.notice(this.$t("notice.internet_speed_is_too_slow_now_image_display_has_been_turned_off"), 'warning');
              }
              //处理隐藏
              if (this.userList.length !== 0 && !this.userList.map(x => x.name).includes(this.info.name)) {
                this.update()
              }
            }).catch(error => {
                    this.notice(error, 'error');
                });
            }
          //this.updateLeftDomHeight()
        },
        methods: {
            autoLoadButtom: function () {
              this.loading(1)
            },
            cancelAll: function () {
                Object.keys(this.controller).map(cancel => {
                  this.controller[cancel][this.controller[cancel].length - 1].abort()
                  this.controller[cancel].push(new AbortController())
                })
            },
            loading: function (type = 0) {
                if (this.tweetStatus.bottomTweetId && this.tweetStatus.topTweetId) {
                    //0 -> top, 1 -> bottom
                    this.load[(type === 0 ? 'top' : 'bottom')] = true;
                    this.controller.refreshTweetsSignal[this.controller.refreshTweetsSignal.length - 1].abort()
                    this.controller.refreshTweetsSignal.push(new AbortController())
                  fetch(this.mergeUrl() + (type === 0 ? '&refresh=1&tweet_id=' + this.tweetStatus.topTweetId.toString() : '&refresh=0&tweet_id=' + this.tweetStatus.bottomTweetId.toString() + (this.hidden ? '&hidden=1' : '')), {
                    signal: this.controller.refreshTweetsSignal[this.controller.refreshTweetsSignal.length - 1].signal
                  }).then(async response => {
                        response = await response.json()
                        if (type === 0) {
                          this.notice(this.$tc("timeline.scripts.message.update_tweets", (response.data.tweets.length > 1 ? 2 : 1), [response.data.tweets.length]), "success");
                          //this.getUserInfo();
                          if (response.data.top_tweet_id && response.data.top_tweet_id !== "0") {
                            this.tweetStatus.topTweetId = response.data.top_tweet_id;
                          }
                          if (this.chart.generate && this.tweetStatus.displayType === 'timeline') {
                            this.createChart(this.chart.latestTimestamp, true)
                          }
                          this.$store.dispatch({
                            type: 'setCoreValue',
                            key: 'tweets',
                            value: [...response.data.tweets, ...this.tweets]
                          })
                          this.load.top = false;
                        } else {
                            this.tweetStatus.moreTweets = response.data.hasmore;
                            if (response.data.bottom_tweet_id) {
                                this.tweetStatus.bottomTweetId = response.data.bottom_tweet_id;
                            }
                          this.$store.dispatch({
                            type: 'pushCoreValue',
                            key: 'tweets',
                            value: [...response.data.tweets]
                          })
                          this.load.bottom = false;
                        }
                    }).catch(error => {
                        if (!this.controller.refreshTweetsSignal[this.controller.refreshTweetsSignal.length - 1].signal.aborted) {
                          this.notice(this.$t("public.loading"), "warning")
                        } else {
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
                this.controller.infoSignal[this.controller.infoSignal.length - 1].abort()
                this.controller.infoSignal.push(new AbortController())
                fetch(this.settings.basePath + '/api/v2/data/userinfo/?name=' + name, {
                    signal: this.controller.infoSignal[this.controller.infoSignal.length - 1].signal
                }).then(async response => {
                  response = await response.json()
                    this.info = response.data;
                    if (response.code === 200) {
                      //this.chart.legendName = {
                      //  '关注者': '关注者 ' + this.info.followers,
                      //  '正在关注': '正在关注 ' + this.info.following,
                      //  '总推文数': '总推文数 ' + this.info.statuses_count
                      //};
                        this.tweetStatus.userExist = true;
                        this.createChart();
                    } else {
                      this.notice(response.message, "error");
                      //this.chart.legendName = {'关注者': '关注者', '正在关注': '正在关注', '总推文数': '总推文数'};
                      this.tweetStatus.userExist = false;
                    }
                  this.load.leftCard = false;
                }).catch(error => {
                  if (this.controller.infoSignal[this.controller.infoSignal.length - 1].signal.aborted) {
                    this.notice(this.$t("public.loading"), "warning")
                  } else {
                    this.notice(error, "error")
                  }
                  //this.load.leftCard = false;
                });
            },
          createChart: function (time = 0, refresh = false) {
            fetch(this.settings.basePath + '/api/v2/data/chart/?uid=' + this.info.uid_str + (time > 0 ? '&end=' + time : '') + (refresh ? '&refresh=1' : '')).then(async response => {
              response = await response.json()
              if (response.data.length) {
                this.chart.latestTimestamp = response.data.slice(-1)[0].timestamp
              }
              let tmpRows = response.data.map(x => {
                x.timestamp = (new Date(x.timestamp * 1000)).toLocaleString(this.settings.language)
                return x
              })
              this.chart.rows = refresh ? [...this.chart.rows, ...tmpRows] : tmpRows
              if (!this.chart.rows.length && !refresh) {
                this.chart.generate = false
                //this.notice("chart: " + response.message, "warning");
              }
            }).catch(error => {
              if (this.tweetStatus.displayType === "timeline" && !/^AbortError/.test(error.toString())) {
                this.notice(this.$t("timeline.scripts.message.failed_to_generate_chart", [error]), 'error');
                setTimeout(() => {
                  this.createChart(time, refresh)
                }, 5000);
              }
            });
            },
            update: function () {
              this.controller.updateTweetsSignal[this.controller.updateTweetsSignal.length - 1].abort()
              this.controller.updateTweetsSignal.push(new AbortController())
              fetch(this.mergeUrl() + (this.hidden ? '&hidden=1' : ''), {
                signal: this.controller.updateTweetsSignal[this.controller.updateTweetsSignal.length - 1].signal
              }).then(async response => {
                  response = await response.json()
                  this.$store.dispatch({
                    type: 'setCoreValue',
                    key: 'tweets',
                    value: response.data.tweets ? response.data.tweets : []//404时无任何数据
                  })
                  this.tweetStatus.moreTweets = response.data.hasmore;
                  if (response.data.top_tweet_id !== "0") {
                    this.tweetStatus.topTweetId = response.data.top_tweet_id;
                  }
                  if (response.data.bottom_tweet_id !== "0") {
                    this.tweetStatus.bottomTweetId = response.data.bottom_tweet_id;
                  }
                  this.load.timeline = false;
                  this.tweetStatus.reload = (response.code !== 200 && response.code !== 404 && response.code !== 403);
              }).catch(error => {
                    if (this.controller.updateTweetsSignal[this.controller.updateTweetsSignal.length - 1].signal.aborted) {
                      this.notice(this.$t("public.loading"), "warning")
                    } else {
                      this.notice(error, "error")
                      this.tweetStatus.reload = true;
                      this.load.timeline = false;
                    }
                })
            },
            mergeUrl: function () {
                //拼装url
                let url = this.settings.basePath + '/api/v2/data/';
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
                  queryStringObject.set('date', (Date.parse(this.search.keywords + ' GMT' + this.userTimeZone) / 1000).toString())
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
                      queryStringObject.set('start', (this.search.advancedSearch.start === "" ? -1 : Date.parse(this.search.advancedSearch.start + ' GMT' + this.userTimeZone) / 1000).toString())
                      queryStringObject.set('end', (this.search.advancedSearch.end === "" ? -1 : Date.parse(this.search.advancedSearch.end + ' GMT' + this.userTimeZone) / 1000).toString())
                      queryStringObject.set('order', this.search.advancedSearch.order ? '1' : '0')
                      queryStringObject.set('advanced', 1)
                      if (this.settings.adminStatus) {
                        queryStringObject.set('hidden', this.search.advancedSearch.hidden ? '1' : '0')
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
                this.$store.dispatch({
                  type: 'setCoreValue',
                  key: 'home',
                  value: false
                })
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
                          media: to.query.tweet_media !== '0',//media
                        },
                        start: to.query.start,
                        end: to.query.end,
                        order: to.query.order === '1',//正序0, 倒序1
                        hidden: to.query.hidden === '1',
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
          createRealMediaPath: function (type = 'tweets') {
            return this.realMediaPath + (this.samePath ? type + '/' : '')
          },
          swapDisplayPictureStatus: function () {
            this.$store.commit('swapDisplayPictureStatus')
          },
        },
    }
</script>

<style>

</style>
