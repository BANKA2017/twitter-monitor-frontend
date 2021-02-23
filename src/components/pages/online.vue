<template>
    <div id="online">
        <!--nav bar-->
        <nav class="navbar navbar-light bg-light">
            <span class="navbar-brand mb-0 h1">Twitter Monitor Online</span>
        </nav>
        <div class="container">
            <div class="row">
                <el-skeleton v-if="load" :paragraph="{rows: 8}" active class="mt-3 col-md-8 offset-md-2" title></el-skeleton>
                <div v-else-if="!load && media.length === 0" class="col-md-8 offset-md-2">
                    <div class="my-4" />
                      <div v-once id="tmolTips">
                        <div class="card">
                          <div class="card-body">
                            <h5 class="card-title">媒体加载器帮助</h5>
                            <h6 class="card-subtitle mb-2 text-muted">只支持带有图片或视频的推文，不支持卡片中的媒体文件</h6>
                            <span>如果一个推文链接为 <code>https://twitter.com/i/status/123456</code>，那么可在输入框填入</span>
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
                      <router-link is="el-button" slot="append" :to="`/i/online/` + tweet_id" icon="el-icon-search"></router-link>
                    </el-input>
                </div>
                <div v-else class="col-md-8 offset-md-2">
                  <el-input v-model="tweet_id" class="mt-4" clearable placeholder="tweet id" @change="inputChange">
                    <router-link is="el-button" slot="append" :to="`/i/online/` + tweet_id" icon="el-icon-search"></router-link>
                  </el-input>
                  <image-list :is_video="video ? '1' : '0'" :list="media" class="my-4" preload="metadata" style="width:100%" unlimited/>
                  <template v-if="video">
                    <span class="lead">Download</span>
                    <div class="list-group my-2">
                      <template v-for="(videoInfo, order) in rawData.video_info.variants">
                        <a :key="order" :href="videoInfo.url" class="text-muted text-decoration-none list-group-item list-group-item-action d-flex justify-content-between align-items-center" target="_blank">
                          {{ videoInfo.content_type === 'video/mp4' ? videoInfo.url.replace(/.*vid\/([0-9]+x[0-9]+).*/, `$1`) : 'm3u8' }}
                          <span v-if="videoInfo.content_type === 'video/mp4'" class="badge badge-primary badge-pill">{{ videoInfo.bitrate / 1000 }} kbps</span>
                        </a>
                      </template>
                    </div>
                  </template>
                  <pre><code class="json">{{ rawData }}</code></pre>
                  <!--<tweet :order="-1" :tweet="tweet" class="col-md-8 offset-md-2" display="all" display-type="timeline"/>-->
                </div>

            </div>
            <div class="mx-auto text-center">
                <div class="my-4"></div>
                >_ Twitter Monitor
            </div>
        </div>
    </div>
</template>

<script>
    //TODO tmol真的烦
    //import UserInfo from "../modules/userInfo";
    import axios from "axios";
    import ImageList from "@/components/modules/imageList";
    //import Tweet from "@/components/modules/tweet";
    const CancelToken = axios.CancelToken;
    let cancel;
    export default {
        name: "online",
      components: {ImageList},
      //components: {Tweet, UserInfo},
        data() {
            return {
                //独立运营
                //basePath: process.env.NODE_ENV !== "development" ? "https://bangdream.fun/twitter" : "https://bangdream.fun/dev/tmv2",
                tweet_id: "",
                //tweets: {},
                //users: {},
                rawData: {},
                media: [],
                debug: false,
                load: true,
                video: false,
            }
        },
      computed: {
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
      },
      beforeRouteEnter(to, from, next) {
        //none
        next(vm => {
          cancel();
          vm.routeCase(to)
          next()
        })
      },
      beforeRouteUpdate(to, from, next) {
        this.routeCase(to)
        next()
      },
      mounted: function () {
        this.routeCase(this.$route)
      },
        methods: {
          fetchMedia: function () {
            this.load = true
            this.media = []
            this.video = false
            this.rawData = {}
            //https://tm.bangdream.fun/tmv2/api/v2/online/info/?tweet_id=1355686950640836609
            axios.get(this.basePath + '/api/v2/online/media/?tweet_id=' + this.tweet_id, {
              cancelToken: new CancelToken(c => cancel = c)
            }).then(response => {
              if (response.data.code === 200) {
                //this.getUserInfo();
                this.rawData = response.data.data
                this.media = response.data.data.media_info
                this.video = response.data.data.video
                if (this.media.length > 0) {
                  this.notice("加载成功", "success");
                } else {
                  this.notice("没有数据", "warning");
                }
              } else {
                this.notice(response.data.message, "error");
              }
              this.load = false
            }).catch(error => {
              if (error.toString() !== 'Cancel') {
                this.notice(error, "error")
                this.load = false
              }
            });
          },
            fetchInfo: function () {
              this.tweets = {}
              this.users = {}
              //https://tm.bangdream.fun/tmv2/api/v2/online/info/?tweet_id=1355686950640836609
              axios.get(this.basePath + '/api/v2/online/info/?tweet_id=' + this.tweet_id, {
                cancelToken: new CancelToken(c => cancel = c)
              }).then(response => {
                if (response.data.code === 200) {
                  this.notice("加载成功", "success");
                  //this.getUserInfo();
                  this.tweets = response.data.data.tweets
                  this.users = response.data.data.users
                } else {
                  this.notice(response.data.message, "error");
                }
                this.load = false
              }).catch(error => {
                if (error.toString() !== 'Cancel') {
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



            notice: function (text, status) {
                this.$parent.notice(text, status);
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
              this.$router.push('/i/online/' + this.tweet_id)
            }
        }
    }
</script>

<style scoped>

</style>
