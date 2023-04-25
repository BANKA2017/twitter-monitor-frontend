<template>
  <div id="online">
    <div class="container">
      <div class="row">
        <div v-if="state.load" class="mt-3 col-md-8 offset-md-2">
          <el-skeleton :rows="5" animated></el-skeleton>
        </div>
        <div v-else-if="!state.load && state.media.length === 0" class="col-md-8 offset-md-2">
          <div class="my-4" />
          <div v-once id="tmolTips">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">媒体加载器帮助</h5>
                <h6 class="card-subtitle mb-2 text-muted">只支持带有图片或视频的推文，不支持卡片中的媒体文件</h6>
                <p class="fw-bold">暂不支持NSFW类媒体（即要求登录账号验证年龄方可查看的推文）</p>
                <p>填写 tweet id （即那串数字）或者推文链接，若链接为 <code>https://twitter.com/i/status/123456</code>，可在输入框填入</p>
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
          <el-input v-model="state.tweet_id" clearable placeholder="tweet id" @change="inputChange">
            <template #append>
              <router-link is="el-button" :to="`/i/tools/media/` + state.tweet_id"><search-icon height="1em" status="" width="1em" /></router-link>
            </template>
          </el-input>
        </div>
        <div v-else class="col-md-8 offset-md-2">
          <el-input v-model="state.tweet_id" class="mt-4" clearable placeholder="tweet id" @change="inputChange">
            <template #append>
              <router-link is="el-button" :to="`/i/tools/media/` + state.tweet_id"><search-icon height="1em" status="" width="1em" /></router-link>
            </template>
          </el-input>
          <image-list :is_video="Number(state.video)" :list="state.media" class="my-4" preload="metadata" size="orig" style="width:100%" unlimited/>
          <span class="lead">Download</span>
          <div class="list-group my-2">
            <template v-for="(mediaInfo, mediaOrder) in state.media" :key="mediaInfo.basename">
              <a v-if="mediaInfo.content_type !== 'video/mp4'" :href="createRealMediaPath(realMediaPath, samePath,'tweets') + mediaInfo.url + `:orig`" class="text-muted text-decoration-none list-group-item list-group-item-action d-flex justify-content-between align-items-center" target="_blank">
                {{ mediaInfo.basename }}
                <div >
                  <span class="badge bg-success rounded-pill">{{ mediaOrder+1 }}</span>
                  <span class="badge bg-primary rounded-pill ms-1">{{ mediaInfo.origin_info_height + 'x' +mediaInfo.origin_info_width }}</span>
                </div>
              </a>
              <a v-else :href="createRealMediaPath(realMediaPath, samePath,'tweets') + video.url.replace('https://', '')" class="text-muted text-decoration-none list-group-item list-group-item-action d-flex justify-content-between align-items-center" target="_blank" v-for="(video, order) in ((state.rawData.video_info.filter(x => RegExp(mediaInfo.media_key.split('_')[1]).test(x.variants[0].url))[0]||[])?.variants||[]).sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))" :key="order">
                {{ video.url.replace(/.*\/(.*)\.(?:mp4|m3u8).*/, `$1`)}}
                <div>
                  <span class="badge bg-primary rounded-pill">{{ video.content_type === 'video/mp4' ? video.url.replace(/.*\/(\d+x\d+)\/.*/, `$1`) : `m3u8` }}</span>
                  <span v-if="video.content_type === 'video/mp4'" class="badge bg-primary rounded-pill ms-1 d-none d-md-inline-block">{{ video.bitrate / 1000 + ' kbps'}}</span>
                    <span class="badge bg-success rounded-pill ms-1">{{ mediaOrder+1 }}</span>
                </div>
              </a>
            </template>
          </div>
          <pre v-if="state.debug"><code class="json">{{ state.rawData }}</code></pre>
          <!--<tweet :order="-1" :tweet="tweet" class="col-md-8 offset-md-2" display="all" display-type="timeline"/>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageList from "../../components/TweetImages.vue"
import Navigation from "../../components/Navigation.vue"
import {computed, defineComponent, onMounted, reactive, ref, Ref, toRefs} from "vue"
import {useHead} from "@vueuse/head"
import SearchIcon from "../../icons/SearchIcon.vue"
import {useStore} from "../../store";
import {OnlineMedia, OnlineMediaList} from "../../types/Content";
import {Controller, request} from "../../share/Fetch";
import {ApiOnlineMedia} from "../../types/Api";
import {Notice, createRealMediaPath} from "../../share/Tools";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {RouterNameList} from "../../share/Content";
import {useI18n} from "vue-i18n";
useHead({
  title: '媒体加载器',
})
const {t} = useI18n()
const route = useRoute()
const router = useRouter()
const store = useStore()
const settings = computed(() => store.state.settings)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)
const onlinePath = computed(() => store.state.onlinePath)
const state = reactive<{
  tweet_id: string
  rawData: OnlineMediaList | {}
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
  request<ApiOnlineMedia>(onlinePath.value + '/api/v3/data/media/?tweet_id=' + state.tweet_id, controller).then(response => {
    if (response.code === 200) {
      state.rawData = response.data
      state.media = response.data?.media_info ??[]
      if (response.data.video) {
        state.video = response.data.video
      }

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
    router.push('/i/tools/media/' + state.tweet_id)
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
</script>

<style scoped>

</style>
