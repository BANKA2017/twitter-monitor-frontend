<template>
    <div id="online">
        <navigation display-name="Twitter Monitor Online" display-type="online" />
        <div class="container">
            <div class="row">
                <el-skeleton v-if="load" :rows="5" animated class="mt-3 col-md-8 offset-md-2"></el-skeleton>
                <div v-else-if="!load && media.length === 0" class="col-md-8 offset-md-2">
                    <div class="my-4" />
                      <div v-once id="tmolTips">
                        <div class="card">
                          <div class="card-body">
                            <h5 class="card-title">媒体加载器帮助</h5>
                            <h6 class="card-subtitle mb-2 text-muted">只支持带有图片或视频的推文，不支持卡片中的媒体文件</h6>
                            <span>填写 tweet id （即那串数字）或者推文链接，若链接为 <code>https://twitter.com/i/status/123456</code>，可在输入框填入</span>
                            <div class="card-body">
                              <ul>
                                <li><code>123456</code></li>
                                <li><code>https://twitter.com/i/status/123456</code></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    <div class="my-4" />
                    <el-input v-model="tweet_id" clearable placeholder="tweet id" @change="inputChange">
                      <template #append>
                        <router-link is="el-button" :to="`/i/online/` + tweet_id"><search-icon height="1em" status="" width="1em" /></router-link>
                      </template>
                    </el-input>
                </div>
                <div v-else class="col-md-8 offset-md-2">
                  <el-input v-model="tweet_id" class="mt-4" clearable placeholder="tweet id" @change="inputChange">
                    <template #append>
                      <router-link is="el-button" :to="`/i/online/` + tweet_id"><search-icon height="1em" status="" width="1em" /></router-link>
                    </template>
                  </el-input>
                  <image-list :is_video="Number(video)" :list="media" class="my-4" preload="metadata" size="orig" style="width:100%" unlimited/>
                    <span class="lead">Download</span>
                    <div class="list-group my-2">
                      <template v-for="(mediaInfo, order) in (video ? rawData.video_info.variants : media)" :key="order">
                        <a :href="(video ? '' : `https://`) + mediaInfo.url + (video ? '' : `:orig`)" class="text-muted text-decoration-none list-group-item list-group-item-action d-flex justify-content-between align-items-center" target="_blank">
                          {{ video ? mediaInfo.content_type === 'video/mp4' ? mediaInfo.url.replace(/.*vid\/([0-9]+x[0-9]+).*/, `$1`) : 'm3u8' : mediaInfo.basename}}
                          <span v-if="!video || mediaInfo.content_type === 'video/mp4'" class="badge badge-primary badge-pill">{{ video ? mediaInfo.bitrate / 1000 + 'kbps' : mediaInfo.origin_info_height + 'x' +mediaInfo.origin_info_width }}</span>
                        </a>
                      </template>
                    </div>
                  <pre v-if="debug"><code class="json">{{ rawData }}</code></pre>
                  <!--<tweet :order="-1" :tweet="tweet" class="col-md-8 offset-md-2" display="all" display-type="timeline"/>-->
                </div>

            </div>
            <div class="mx-auto text-center">
                <div class="md-4"></div>
                >_ Twitter Monitor
            </div>
        </div>
    </div>
</template>

<script>
    //import UserInfo from "../modules/userInfo";
    import ImageList from "@/components/modules/imageList";
    import Navigation from "@/components/modules/Navigation";
    import {mapState} from "vuex";
    import {inject} from "vue";
    import {useHead} from "@vueuse/head";
    import SearchIcon from "@/components/icons/searchIcon";
    //import Tweet from "@/components/modules/tweet";
    export default {
      name: "online",
      setup () {
        useHead({
          title: '媒体加载器',
        })
        const notice = inject('notice')
        let controller = {
          infoSignal: [new AbortController()],
          mediaSignal: [new AbortController()],
        }
        return {
          notice,
          controller
        }
      },
      components: {SearchIcon, Navigation, ImageList},
      //components: {Tweet, UserInfo},
        data: () => ({
          //独立运营
          //basePath: process.env.NODE_ENV !== "development" ? "https://bangdream.fun/twitter" : "https://bangdream.fun/dev/tmv2",
          tweet_id: "",
          //tweets: {},
          //users: {},
          rawData: {},
          media: [],
          debug: true,
          load: true,
          video: false,
        }),
      computed: mapState({
        settings: 'settings',
          //tweet: function () {
          //  let tmpTweet = {}
          //  let tmpTweetOutput = {
          //    tweet_id: "",
          //    name: "",
          //    display_name: "",
          //    media: "0",
          //    video: "0",
          //    card: "",
          //    poll: "0",
          //    quote_status: "0",
          //    source: "Twitter Web App",
          //    full_text_origin: "",
          //    retweet_from: "",
          //    retweet_from_name: "",
          //    dispute: "0",
          //    time: "0",
          //    type: "tweet",
          //    mediaObject: {tweetsMedia: [], quoteMedia: [], cardMedia: []},
          //    quoteObject: [],
          //    cardObject: [],
          //    entities: [],
          //  }
          //  if (this.tweet_id && this.tweets !== {}) {
          //    tmpTweetOutput.name = this.users[this.tweets[this.tweet_id].user_id_str].screen_name
          //    tmpTweetOutput.display_name = this.users[this.tweets[this.tweet_id].user_id_str].name
          //    tmpTweetOutput.tweet_id = this.tweets[this.tweet_id].id_str
          //    if (this.tweets[this.tweet_id].retweeted_status_id_str) {
          //      //转推
          //      tmpTweet = this.tweets[this.tweets[this.tweet_id].retweeted_status_id_str]
          //      tmpTweetOutput.retweet_from_name = this.users[tmpTweet.user_id_str].screen_name
          //      tmpTweetOutput.retweet_from = this.users[tmpTweet.user_id_str].name
          //    } else {
          //      tmpTweet = this.tweets[this.tweet_id]
          //    }
          //    tmpTweetOutput.full_text_origin = tmpTweet.full_text

          //  }
          //    return tmpTweetOutput
          //}
      }),
      beforeRouteEnter(to, from, next) {
        //none
        next(vm => {
          vm.cancelAll();
          vm.routeCase(to)
        })
      },
      beforeRouteUpdate(to) {
        this.routeCase(to)
      },
      //mounted: function () {
      //  this.routeCase(this.$route)
      //},
      methods: {
        cancelAll: function () {
          Object.keys(this.controller).map(cancel => {
            this.controller[cancel][this.controller[cancel].length - 1].abort()
            this.controller[cancel].push(new AbortController())
          })
        },
        fetchMedia: function () {
          this.load = true
          this.media = []
          this.video = false
          this.rawData = {}
          //https://tm.bangdream.fun/tmv2/api/v2/online/info/?tweet_id=1355686950640836609
          this.controller.mediaSignal[this.controller.mediaSignal.length - 1].abort()
          this.controller.mediaSignal.push(new AbortController())
          fetch(this.settings.data.basePath + '/api/v2/online/media/?tweet_id=' + this.tweet_id, {
            signal: this.controller.mediaSignal[this.controller.mediaSignal.length - 1].signal
          }).then(async response => {
            response = await response.json()
            if (response.code === 200) {
              //this.getUserInfo();
              this.rawData = response.data
              this.media = response.data.media_info
              this.video = response.data.video
              if (this.media.length > 0) {
                this.notice("加载成功", "success");
              } else {
                this.notice("没有数据", "warning");
              }
            } else {
              this.notice(response.message, "error");
            }
            this.load = false
          }).catch(error => {
            if (!this.controller.mediaSignal[this.controller.mediaSignal.length - 1].signal.aborted) {
              this.notice(error, "error")
              this.load = false
            }
          });
        },
          fetchInfo: function () {
            this.tweets = {}
            this.users = {}
            //https://tm.bangdream.fun/tmv2/api/v2/online/info/?tweet_id=1355686950640836609
            this.controller.infoSignal[this.controller.infoSignal.length - 1].abort()
            this.controller.infoSignal.push(new AbortController())
            fetch(this.settings.data.basePath + '/api/v2/online/info/?tweet_id=' + this.tweet_id, {
              signal: this.controller.infoSignal[this.controller.infoSignal.length - 1].signal
            }).then(async response => {
              response = await response.json()
              if (response.code === 200) {
                this.notice("加载成功", "success");
                //this.getUserInfo();
                this.tweets = response.tweets
                this.users = response.data.users
              } else {
                this.notice(response.message, "error");
              }
              this.load = false
            }).catch(error => {
              if (!this.controller.infoSignal[this.controller.infoSignal.length - 1].signal.aborted) {
                this.notice(error, "error")
                this.load = false
              }
            });
          },
          routeCase: function (to = this.$route) {
            this.rawData = {}
            this.media = []
            this.video = false
            if (to.params.tweet_id) {
              this.tweet_id = to.params.tweet_id
              this.fetchMedia()
            } else {
              this.load = false
            }
          },
          updateProtect: function (val) {
              this.protect = val;
          },
          updateUserExist: function (val) {
              this.userExist = val;
          },
          updateUid: function (val) {
              this.uid = val;
          },
          inputChange: function () {
            if (isNaN(Number(this.tweet_id))) {
              //非数字
              let tmpTweetId = this.tweet_id.replace(/.*\/status\/([0-9]+).*/gm, `$1`)
              if (isNaN(Number(tmpTweetId))) {
                this.tweet_id = ""
              } else {
                this.tweet_id = tmpTweetId
              }
            }

            if (this.tweet_id) {
              this.$router.push('/i/online/' + this.tweet_id)
            }
          }
      }
    }
</script>

<style scoped>

</style>
