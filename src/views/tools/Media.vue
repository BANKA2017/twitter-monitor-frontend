<template>
  <div id="online">
    <navigation display-name="Twitter Monitor Online" display-type="online" />
    <div class="container">
      <div class="row">
        <div v-if="load" class="mt-3 col-md-8 offset-md-2">
          <el-skeleton :rows="5" animated></el-skeleton>
        </div>
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
              <a :href="(video ? '' : `https://`) + mediaInfo.url + (video || mediaInfo.source !== 'tweets' ? '' : `:orig`)" class="text-muted text-decoration-none list-group-item list-group-item-action d-flex justify-content-between align-items-center" target="_blank">
                {{ video ? mediaInfo.content_type === 'video/mp4' ? mediaInfo.url.replace(/.*vid\/([0-9]+x[0-9]+).*/, `$1`) : 'm3u8' : mediaInfo.basename}}
                <span v-if="!video || mediaInfo.content_type === 'video/mp4'" class="badge bg-primary rounded-pill">{{ video ? mediaInfo.bitrate / 1000 + ' kbps' : mediaInfo.origin_info_height + 'x' +mediaInfo.origin_info_width }}</span>
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

<script lang="ts">
import ImageList from "@/components/TweetImages.vue"
import Navigation from "@/components/Navigation.vue"
import {computed, defineComponent, onMounted, reactive, ref, Ref, toRefs} from "vue"
import {useHead} from "@vueuse/head"
import SearchIcon from "@/icons/SearchIcon.vue"
import {useStore} from "@/store";
import {OnlineMedia} from "@/type/Content";
import {Controller, request} from "@/share/Fetch";
import {ApiOnline} from "@/type/Api";
import {Notice} from "@/share/Tools";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {RouterNameList} from "@/share/Content";
import {useI18n} from "vue-i18n";
export default defineComponent({
  components: {SearchIcon, Navigation, ImageList},
  setup () {
    useHead({
      title: '媒体加载器',
    })
    const {t} = useI18n()
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const settings = computed(() => store.state.settings)
    const state = reactive<{
      tweet_id: string
      rawData: any
      media: OnlineMedia[]
      debug: boolean
      load: Ref<boolean>
      video: boolean
    }>({
      tweet_id: "",
      rawData: {},
      media: [],
      debug: true,
      load: ref(false),
      video: false,
    })

    const controller = new Controller()
    const fetchMedia = () => {
      state.load = true
      state.media = []
      state.video = false
      state.rawData = {}
      //https://tm.bangdream.fun/tmv2/api/v2/online/info/?tweet_id=1355686950640836609
      request<ApiOnline>(settings.value.basePath + '/api/v2/online/media/?tweet_id=' + state.tweet_id, controller).then(response => {
        if (response.code === 200) {
          state.rawData = response.data
          state.media = response.data.media_info
          state.video = response.data.video
          if (state.media.length > 0) {
            Notice("加载成功", "success")
          } else {
            Notice("没有数据", "warning")
          }
        } else {
          Notice(response.message, "error")
        }
        state.load = false
      }).catch(e => {
        if (controller.afterAbortSignal.aborted) {
          Notice(t("public.loading"), "warning")
        } else {
          Notice(e, "error")
          state.load = false
        }
      })
    }

    //const fetchInfo = () => {
    //  this.tweets = {}
    //  this.users = {}
    //  //https://tm.bangdream.fun/tmv2/api/v2/online/info/?tweet_id=1355686950640836609
    //  this.controller.infoSignal[this.controller.infoSignal.length - 1].abort()
    //  this.controller.infoSignal.push(new AbortController())
    //  fetch(this.settings.data.basePath + '/api/v2/online/info/?tweet_id=' + this.tweet_id, {
    //    signal: this.controller.infoSignal[this.controller.infoSignal.length - 1].signal
    //  }).then(async response => {
    //    response = await response.json()
    //    if (response.code === 200) {
    //      this.notice("加载成功", "success");
    //      //this.getUserInfo();
    //      this.tweets = response.tweets
    //      this.users = response.data.users
    //    } else {
    //      this.notice(response.message, "error");
    //    }
    //    this.load = false
    //  }).catch(error => {
    //    if (!this.controller.infoSignal[this.controller.infoSignal.length - 1].signal.aborted) {
    //      this.notice(error, "error")
    //      this.load = false
    //    }
    //  });
    //}

    const routeCase = (to = route) => {
      state.rawData = {}
      state.media = []
      state.video = false
      if (to.params.tweet_id) {
        state.tweet_id = to.params.tweet_id.toString()
        fetchMedia()
      } else {
        state.load = false
      }
    }

    const inputChange = () => {
      if (isNaN(Number(state.tweet_id))) {
        //非数字
        let tmpTweetId = state.tweet_id.replace(/.*\/status\/([0-9]+).*/gm, `$1`)
        if (isNaN(Number(tmpTweetId))) {
          state.tweet_id = ""
        } else {
          state.tweet_id = tmpTweetId
        }
      }

      if (state.tweet_id) {
        router.push('/i/online/' + state.tweet_id)
      }
    }

    onMounted(() =>  {
      routeCase()
    })
    onBeforeRouteUpdate((to, from, next) => {
      if (RouterNameList.online.has(typeof to.name === 'string' ? to.name : '')) {
        routeCase(to)
      }
      next()
    })
    return {...toRefs(state), settings, inputChange}
  }

})
</script>

<style scoped>

</style>
