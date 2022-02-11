<template>
  <div id="tweets">
    <nav :style="{'position': 'sticky', 'top': '1.5rem', 'z-index': 1, 'background-color': 'rgba(255, 255, 255, 0.9)', 'border-radius': '0.25rem'}" class="nav nav-pills nav-fill border">
      <!--v-if="tweetStatus.displayType === 'timeline' && !load.leftCard"-->
      <template v-if="$route.name === 'name-display'">
        <li v-for="(value, s) in displayMode" :key="s" class="nav-item">
          <!--TODO update while click-->
          <!--tweetStatus.display-->
          <div v-if="value[1] === tweetTypeValue" class="nav-link active" role="button" @click="loading(true)">{{ value[0] }}</div>
          <router-link v-else :to="`./`+value[1]" class="nav-link">{{ value[0] }}</router-link>
        </li>
      </template>
      <li class="nav-item">
        <div :class="{'nav-link': true, 'active': settings.displayPicture, 'text-primary': !settings.displayPicture}" role="button" @click="swapDisplayPictureStatus">{{ t("timeline.nav_bar.no_image") }}</div>
      </li>
    </nav>
    <hr class="my-4">
    <div class="text-center" element-loading-background="rgba(255, 255, 0, 0)" style="height: 60px" v-if="state.loadingTop" v-loading="state.loadingTop"></div>

    <el-skeleton :loading="state.loadingTimeline" :rows="5" animated class="mb-2">
      <div class="text-center" v-if="state.reload">
        <el-button round @click="update()"><arrow-clockwise height="1em" status="" width="1em" />{{ t("public.retry") }}
        </el-button>
      </div>
      <div v-if="!state.reload && tweets.length">
        <div v-for="(tweet, order) in tweets" :key="order">
          <div class="text-center" v-if="tweet.type === 'msg'">
            {{ tweet.full_text }}
          </div>
          <div v-else>
            <!--TODO fix top tweet id which from userinfo-->
            <tweet-item :display="tweetModeValue" :display-type="tweetTypeValue" :top="0" :order="order" :tweet="tweet"/>
          </div>
          <hr class="my-4">
        </div>
        <button v-if="state.moreTweets && !state.loadingBottom" class="btn btn-primary btn-lg btn-block mb-3" type="button" @click="loading(false)">
          <span>{{ t("timeline.message.load_more") }}</span>
        </button>
        <el-skeleton v-else-if="state.moreTweets && state.loadingBottom" :rows="1" animated class="mb-2"/>
        <div v-else-if="!(tweetModeValue === 'status')">
          <h5 class="text-center">{{ t("timeline.message.no_more") }}</h5>
        </div>
      </div>
      <div v-else-if="!state.reload">
        <h5 class="text-center">{{ t("timeline.message.no_more") }}</h5>
      </div>
    </el-skeleton>
  </div>
  <!--TODO REFRESH-->
  <transition name="el-fade-in" v-if="$route.name !== 'name-status'">
    <div class="el-backtop" style="right: 40px; bottom: 90px; z-index: 1500" @click="() => {ScrollTo(); loading(true)}">
      <arrow-clockwise height="1em" status="" width="1em" />
    </div>
  </transition>
</template>

<script setup lang="ts">
import {useStore} from "@/store";
import {computed, reactive, ref, Ref, defineComponent, toRefs, watch} from "vue";
import {useI18n} from "vue-i18n";
//import TweetItem from "./TweetItem";
import {onBeforeRouteUpdate, RouteLocationNormalized, useRoute, useRouter} from "vue-router";
import {TweetType} from "@/type/State";
import {TweetMode} from "@/type/State";
import {Equal, Notice, NullSafeParams, ScrollTo} from "@/share/Tools";
import {controller, request} from "@/share/Fetch";
import {ApiTweets} from "@/type/Api";
import TweetItem from "@/components/TweetItem.vue";
import ArrowClockwise from "@/icons/ArrowClockwise.vue";
const {t} = useI18n()
const route = useRoute()
const router = useRouter()
const store = useStore()
const userExists = computed(() => store.state.userExists)
const settings = computed(() => store.state.settings)
const tweetModeValue = computed(() => store.state.tweetMode)
const tweetTypeValue = computed(() => store.state.tweetType)
const userTimeZone = computed(() => store.state.userTimeZone)
const adminMode = computed(() => store.state.adminMode)
const tweets = computed(() => store.state.tweets)
const height = computed(() => store.state.height)
const siteHeight = computed(() => store.state.siteHeight)
const viewportHeight = computed(() => store.state.viewportHeight)
const displayMode = [
  [t("timeline.nav_bar.all"), 'all', 0],
  [t("timeline.nav_bar.origin"), 'self', 0],
  [t("timeline.nav_bar.retweet"), 'retweet', 0],
  [t("timeline.nav_bar.media"), 'media', 0]
]
const swapDisplayPictureStatus = () => {
  store.dispatch('swapDisplayPictureStatus')
}
const state = reactive<{
  url: Ref<string>
  queryObject: URLSearchParams
  //status
  loadingTop: boolean
  loadingBottom: boolean
  loadingTimeline: boolean
  //reload
  reload: boolean
  //more
  moreTweets: boolean
  //top and bottom
  topTweetId: string
  bottomTweetId: string
}>({
  url: ref(''),
  queryObject: new URLSearchParams(),
  loadingTimeline: true,
  loadingTop: false,
  loadingBottom: false,
  reload: false,
  moreTweets: false,
  topTweetId: '0',
  bottomTweetId: '0',
})

watch(height, () => {
  if (route.name  !== 'name-status' && siteHeight.value - height.value - viewportHeight.value < 150 && settings.value.autoLoadTweets && !state.loadingBottom) {
    loading(false)
  }
})

//TODO fix type
const setTweetType = (tweetTypeValue: TweetType) => {
  store.dispatch("setCoreValue", {key: 'tweetType', value: tweetTypeValue})
}
const setTweetMode = (tweetModeValue: TweetMode) => {
  store.dispatch("setCoreValue", {key: 'tweetMode', value: tweetModeValue})
}


//TODO null safe
const routeCase = (to: RouteLocationNormalized) => {
  store.dispatch({type: 'setCoreValue', key: 'home', value: false})
  //status 不需要
  let displayIndex = ["all", "self", "retweet", "media"].indexOf(<string>NullSafeParams(to.params.display, ''))
  if (displayIndex !== -1 && (to.name !== 'name-status' && to.name !== 'no-name-status')) {
    setTweetType(["all", "self", "retweet", "media"][displayIndex])
  } else if (to.name === 'name-status' || to.name === 'no-name-status') {
    setTweetType('status')
  } else {
    setTweetType('all')
  }
  //this.load.timeline = true;
  //拼装url
  //TODO fix real basePath
  let url = settings.value.basePath + '/api/v2/data/';
  let queryStringObject = new URLSearchParams()
  switch (to.name) {
    case "hashtag":
    case "cashtag":
      url += to.name + '/'
      let tmpTag = <string>NullSafeParams(to.params.tag, '')
      if (tmpTag === '') {router.push({path: '/search/'}); return}
      queryStringObject.set("hash", tmpTag)
      setTweetMode('tag')
      break
    case "search":
      url += 'search/'
      queryStringObject.set('q', to.query.q ? <string>NullSafeParams(to.query.q, '') : <string>NullSafeParams(to.params.search, ''))
      if (to.query.advanced === '1') {
        queryStringObject.set('text_or_mode', Equal(to.query.text_or_mode !== '0'))
        queryStringObject.set('text_not_mode', Equal(to.query.text_not_mode !== '0'))
        queryStringObject.set('user', <string>NullSafeParams(to.query.user, ''))
        queryStringObject.set('user_and_mode', Equal(to.query.user_and_mode !== '0'))
        queryStringObject.set('user_not_mode', Equal(to.query.user_not_mode !== '0'))
        queryStringObject.set('tweet_type', (to.query.text_or_mode && Number(to.query.text_or_mode) > -1 && Number(to.query.text_or_mode) < 3) ? String(Number(to.query.tweet_type)) : '0')//0-> all, 1-> origin, 2-> retweet
        queryStringObject.set('tweet_media', Equal(to.query.tweet_media !== '0'))//media
        queryStringObject.set('start', (to.query.start === "" ? -1 : Date.parse(to.query.start + ' GMT' + userTimeZone.value) / 1000).toString())
        queryStringObject.set('end', (to.query.end === "" ? -1 : Date.parse(to.query.end + ' GMT' + userTimeZone.value) / 1000).toString())
        queryStringObject.set('order', Equal(to.query.order === '1'))
        queryStringObject.set('advanced', '1')
        if (adminMode) {
          queryStringObject.set('hidden', Equal(to.query.hidden === '1'))
        }
      }
      setTweetMode('search')
      break
    case "no-name-status"://TODO then fetch user data
    case "name-status":
      url += 'tweets/'
      queryStringObject.set('is_status', '1')
      queryStringObject.set('tweet_id', <string>NullSafeParams(to.params.status, ''))
      setTweetMode('status')
      break
    default:
      url += 'tweets/'
      queryStringObject.set('name', <string>NullSafeParams(to.params.name, ''))
      queryStringObject.set('display', <string>NullSafeParams(to.params.display, ''))
      setTweetMode('timeline')
  }
  state.url = url
  state.queryObject = queryStringObject
}

const update = () => {
  state.loadingTimeline = true
  request<ApiTweets>(state.url + '?' + state.queryObject.toString(), controller).then(response => {
    store.dispatch({
      type: 'setCoreValue',
      key: 'tweets',
      value: response.data.tweets
    })// ? response.data.tweets : []//404时无任何数据
    state.moreTweets = response.data.hasmore
    if (response.data.top_tweet_id !== "0") {
      state.topTweetId = response.data.top_tweet_id;
    }
    if (response.data.bottom_tweet_id !== "0") {
      state.bottomTweetId = response.data.bottom_tweet_id;
    }
    state.reload = (![200, 404, 403].includes(response.code))
    state.loadingTimeline = false
    if (route.name === 'no-name-status' && response.data.tweets.length) {
      router.replace({path: '/' + response.data.tweets[0].name + '/status/' + response.data.tweets[0].tweet_id_str})
    }
  }).catch(e => {
    state.loadingTimeline =  false
    Notice(String(e), 'error')
  })
}

const loading = (top: boolean = false) => {
  if (state.topTweetId && state.bottomTweetId) {
    let tmpQueryObject = state.queryObject
    if (top) {
      state.loadingTop =  true
      tmpQueryObject.set("refresh", '1')
      tmpQueryObject.set("tweet_id", state.topTweetId)
    } else {
      state.loadingBottom =  true
      tmpQueryObject.set("refresh", '0')
      tmpQueryObject.set("tweet_id", state.bottomTweetId)
    }
    request<ApiTweets>(state.url + '?' + tmpQueryObject.toString(), controller).then(response => {
      if (top) {
        //TODO check count
        Notice(t("timeline.scripts.message.update_tweets", {count: response.data.tweets.length}), "success");//this.getUserInfo();if (response.data.top_tweet_id && response.data.top_tweet_id !== "0") {
        if (response.data.top_tweet_id !== '0') {
          state.topTweetId = response.data.top_tweet_id;
        }
        //TODO generate chart
        //if (this.chart.generate && this.tweetStatus.displayType === 'timeline') {
        //  this.createChart(this.chart.latestTimestamp, true)
        //}
        store.dispatch({
          type: 'setCoreValue',
          key: 'tweets',
          value: [...response.data.tweets, ...tweets.value]
        })
        state.loadingTop =  false
      } else {
        state.moreTweets = response.data.hasmore;
        if (response.data.bottom_tweet_id !== '0') {
          state.bottomTweetId = response.data.bottom_tweet_id;
        }
        store.dispatch({
          type: 'pushCoreValue',
          key: 'tweets',
          value: [...response.data.tweets]
        })
        state.loadingBottom = false
      }
    }).catch(e => {
      if (top) {
        state.loadingTop = false
      } else {
        state.loadingBottom = false
      }
      Notice(String(e), "error")
    })
  } else {
    Notice(t("timeline.scripts.message.missing_parameter"), "error")
  }
}

const emptyTranslateList = () => {
  store.dispatch("setCoreValue", {key: 'translate', value: {}})
}

routeCase(route)
emptyTranslateList()
if (route.name === 'search' && !route.query.q) {
  state.loadingTimeline = false
} else {
  update()
}
if (route.name === 'search') {
  store.dispatch({
    type: 'setCoreValue',
    key: 'tweets',
    value: []
  })
}
//TODO fix unknown to no-name-status
onBeforeRouteUpdate((to, from) => {
  //status
  if (!((from.name === 'no-name-status' && to.name === 'name-status'))) {
    routeCase(to)
    emptyTranslateList()
    update()
  }
  //search
  if (!(from.name === 'search' && to.name === 'search')) {
    store.dispatch({
      type: 'setCoreValue',
      key: 'tweets',
      value: []
    })
  }
})


</script>

<style scoped>

</style>
