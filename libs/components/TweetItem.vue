<template>
  <div id="tweet">
    <div v-if="false">{{ tweet }}</div>
    <div v-else ref="tweetItem" :id="tweet.tweet_id_str" :class="{'card': true, 'card-border': true, 'border-danger': tweet.dispute === 1, 'border-primary': tweet.tweet_id_str === topTweetId || (settings.loadConversation && $route.name === 'name-status' && $route.params.status === tweet.tweet_id_str), 'tweet-background': ($route.name !== 'name-status' || $route.params.status !== tweet.tweet_id_str)}" @click="clickEvent" :style="translatorMode ? 'border: none' : ''">
      <div class='card-body'>
        <router-link :to="`/i/communities/` + tweet.community?.id" v-if="tweet.community?.id && tweet.community?.name" class="text-muted d-block"><small>
            <community height="1em" width="1em" status="text-muted" class="me-1"/> {{tweet.community?.name}}
        </small></router-link>
        <p v-if="tweetModeValue === 'timeline' && ((tweet.tweet_id_str === topTweetId) || tweet.is_top)"><small class="text-muted">
          <pinned height="1em" width="1em" status="text-muted" class="me-1" />{{ t("tweet.text.pinned_tweet") }}
        </small></p>
        <p v-if="tweet.dispute === 1"><small class="text-muted"><exclamation-circle height="1em" status="" width="1em" /> {{ t("tweet.text.this_is_a_dispute_tweet") }}
          <router-link to="/about">{{ t("tweet.text.learn_more") }}</router-link>
        </small></p>
        <div :dir="tweet.rtl ? 'rtl' : 'ltr'" :class="{'mb-1': true, 'ms-4': settings.onlineMode, 'ms-md-5': settings.onlineMode,}" @click="(e) => {e.stopPropagation()}">
          <span style="font-size: 0.75em;" class="text-muted" v-if="tweet.retweet_from">
            <retweet height="1em" status="" width="1em"/>
            <router-link :to="`/`+(settings.onlineMode ? tweet.retweet_from_name : tweet.name) + `/all`" class="text-muted">
              <full-text :entities="[]" :full_text_origin="tweet.display_name" />
            </router-link>
          </span>
        </div>
        <div @click="(e) => {e.stopPropagation()}" class="position-absolute" style="right: 1em" v-if="!translatorMode">
          <!--bookmark-->
          <book-mark class="text-danger mx-1" v-if="bookMarks.map(x => x.tweet_id).includes(tweet.tweet_id_str)" height="1.5rem" width="1.5rem" @click="updateBookMarks('tweet')"/>
          <book-mark-outline class="text-danger mx-1" v-else height="1.5rem" width="1.5rem" @click="updateBookMarks('tweet')"/>
          <!--media-->
          <image-icon height="2em" status="text-success" width="2em" v-if="tweet.media === 1" class="ms-1" style="cursor:pointer" @click="swapDisplayPictureStatus"/>
          <!--<camera-video-icon v-if="tweet.video === 1" height="2em" status="text-danger" width="2em"/>-->
          <a :href="`//twitter.com/i/status/`+tweet.tweet_id_str" target="_blank">
            <box-arrow-up-right height="2em" status="text-primary" width="2em"/>
          </a>
        </div>
        <div class="row">
          <!--avatar-->
          <div class="col-1 ps-1 pe-0" v-if="tweet?.user_info?.header" @click="(e) => {e.stopPropagation()}">
            <router-link :to="'/' + (tweet.retweet_from_name ? tweet.retweet_user_info.name : tweet.user_info.name) + '/all'">
              <el-image :class="verifiedStatus.verified_type === 'business' ? 'rounded-3' : 'rounded-circle' " :src="createRealMediaPath(realMediaPath, samePath, 'userinfo')+ (tweet.retweet_from_name ? tweet.retweet_user_info.header : tweet.user_info.header).replace(/([\w]+)\.([\w]+)$/gm, `$1_reasonably_small.$2`)" alt="Avatar" />
            </router-link>
          </div>
          <div :class="{'col-11': tweet?.user_info?.header}" :dir="tweet.rtl ? 'rtl' : 'ltr'" @click="(e) => {e.stopPropagation()}">
            <div class="d-block text-truncate" :style="{'max-width': '' + (tweet.media ? 69 : 74) + '%'}">
              <router-link v-if="settings.onlineMode || !tweet.retweet_from_name || (tweet.retweet_from_name && userList.map(x => x.name).includes(tweet.retweet_from_name))" :to="`/`+ (tweet.retweet_from ? tweet.retweet_from_name : tweet.name) + '/all'" class="card-title text-dark fw-bold" :style="{'max-width': '' + (tweet.media ? 65 : 70) + '%'}">
                <full-text :entities="[]" :full_text_origin="tweet.retweet_from ? tweet.retweet_from : tweet.display_name" :inline="true" />
              </router-link>
              <a v-else :href="`//twitter.com/` + tweet.retweet_from_name" class="card-title text-dark fw-bold" target="_blank" :style="{'max-width': '' + (tweet.media ? 65 : 70) + '%'}">
                <full-text :entities="[]" :full_text_origin="tweet.retweet_from" :inline="true" />
              </a>
              <verified v-if="settings.onlineMode && verifiedStatus.verified" height="1em" :status="verifiedStatus.verified_type ? {business: 'text-gold', government: 'text-secondary'}[verifiedStatus.verified_type] : 'text-primary'" width="2em" class="d-inline"/>
              <span style="font-size: 0.75em" class="d-block">@{{ tweet.retweet_from ? tweet.retweet_from_name : tweet.name }}</span>
              <router-link :to="`/search/?q=${tweet.vibe.discoveryQueryText}`" style="font-size: 0.55em; background: #EFF3F4;" class="badge text-black rounded-pill" v-if="settings.onlineMode && tweet.vibe"><full-text :entities="[]" :inline="true" :full_text_origin="`${tweet.vibe.imgDescription}${tweet.vibe.text}`" /></router-link>
            </div>
          </div>
        </div>
        <div class="row my-1">
          <div :class="{'offset-md-1': tweet?.user_info?.header, 'col-md-11': tweet?.user_info?.header, 'col-12': true}">
            <!--<div v-html="`<p class='card-text'>`+tweet.full_text+`</p>`"></div>-->
            <!--excited!-->
            <div :dir="tweet.rtl ? 'rtl' : 'ltr'"><full-text class="card-text" :entities="tweet.entities" :full_text_origin="tweet.full_text_origin" :display-range="(settings.onlineMode && (route.name === 'name-status' || route.name === 'no-name-status' || translatorMode)) ? tweet.display_text_range : [0, 0]" :rich_text_tags="tweet?.richtext?.richtext_tags ? tweet.richtext.richtext_tags : []" /></div>
            <translate v-if="translatorMode || tweet.full_text_origin" :id="tweet.tweet_id_str" :to="settings.language" :text="tweet.full_text" type="0"/>
            <!--media-->
            <div class="mt-2" v-if="tweet.media === 1&&!settings.displayPicture && tweet.mediaObject.filter(x => x.source === 'tweets').length">
              <image-list :is_video="tweet.video" :list="tweet.mediaObject.filter(x => x.source === 'tweets')" :unlimited="tweetModeValue === 'status'"/>
            </div>
            <!--quote-->
            <div class="mt-2" v-if="tweet.quote_status !== 0 && Object.keys(tweet.quoteObject).length !== 0">
              <quote-card :quote-media="tweet.mediaObject.filter(x => x.source === 'quote_status')" :quote-object="tweet.quoteObject"/>
            </div>
            <!--polls-->
            <template v-if="tweet.poll !== 0">
              <tw-polls :media="tweet.mediaObject.filter(x => x.source === 'cards')" :polls="tweet.pollObject" :tweet-id="tweet.tweet_id_str"/>
            </template>
            <!--card-->
            <div class="mt-2" v-else-if="tweet.card !== '' && Object.keys(tweet.cardObject).length">
              <tw-card :media="tweet.mediaObject.filter(x => x.source === 'cards')" :mediaState="!settings.displayPicture" :object="tweet.cardObject" :tweet-text="tweet.full_text_origin.split(`\n`)[0]" :user-name="tweet.retweet_from ? tweet.retweet_from : tweet.display_name"></tw-card>
            </div>
            <!--place-->
            <!--time && source-->
            <div id="foot">
              <small class="text-muted">{{ timeGap(tweet.time, now, settings.language) }} · <span class="text-primary">{{ tweet.source }}</span></small>
            </div>
            <div class="mt-2" v-if="((tweet.retweet_count + tweet.quote_count + tweet.favorite_count) > 0)">
              <hr class="my-2" />
              <div class="d-flex justify-content-between">
                <div class="d-inline-block">
                  <small class="me-4 text-muted fw-bold" v-if="tweet.retweet_count > 0"><retweet height="1.1rem" width="1.1rem" status="text-success me-1"/><span >{{tweet.retweet_count}}</span></small>
                  <small class="me-4 text-muted fw-bold" v-if="tweet.reply_count > 0"><reply height="1.1rem" width="1.1rem" status="text-primary me-1"/><span >{{tweet.reply_count}}</span></small>
                  <small class="me-4 text-muted fw-bold" v-if="tweet.favorite_count > 0"><like height="1.1rem" width="1.1rem"  status="text-danger me-1"/><span >{{tweet.favorite_count}}</span></small>
                </div>
                <!--<div class="d-inline-block" >-->
                  <!--save for image-->
                <!--<small class="text-muted"><span role="button" @click="H2C(tweetItem, 'tweet-' + tweet.tweet_id_str + '.png')">Screenshot</span></small>-->
              <!--</div>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FullText from "./FullText.vue";
import Translate from "./Translate.vue";
import ImageList from "./TweetImages.vue";
import QuoteCard from "./QuoteCard.vue";
import TwPolls from "./TwPolls.vue";
import TwCard from "./TwCard.vue";
import Retweet from "../icons/Retweet.vue";
import ExclamationCircle from "../icons/ExclamationCircle.vue";
import {useStore} from "../store";
import {computed, onMounted, PropType, ref} from "vue";
import {useI18n} from "vue-i18n";
import {BookMarkMedia, Card, Entity, Media, PollItem, Quote, Tweet, UserInfo, Vibe} from "../types/Content";
import {useRoute, useRouter} from "vue-router";
import {request} from "../share/Fetch";
import {ApiUserInfo} from "../types/Api";
import {Notice, VerifiedStatus} from "../share/Tools";
import {createRealMediaPath} from "../share/Tools";
import Pinned from "../icons/Pinned.vue";
import Verified from "../icons/Verified.vue";
import Reply from "../icons/Reply.vue";
import Like from "../icons/Like.vue";
import BookMark from "../icons/BookMark.vue";
import BookMarkOutline from "../icons/BookMarkOutline.vue";
import ImageIcon from "../icons/ImageIcon.vue";
import CameraVideoIcon from "../icons/CameraVideoIcon.vue";
import BoxArrowUpRight from "../icons/BoxArrowUpRight.vue";
import Community from "../icons/Community.vue";
const props = defineProps({
  tweet: {
    type: Object as PropType<Tweet>,
    default: () => ({
      tweet_id: '0',
      tweet_id_str: '0',
      conversation_id_str: '0',
      uid: '0',
      uid_str: '0',
      name: '',
      display_name: '',
      media: 0,
      video: 0,
      card: '',
      poll: 0,
      quote_status: '0',
      quote_status_str: '0',
      source: '',
      full_text: '',
      full_text_origin: '',
      retweet_from: '',
      retweet_from_name: '',
      dispute: 0,
      time: 0,
      type: 'tweet',
      entities: [],
      pollObject: [],
      mediaObject: []
    })
  }
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useStore()
const now = computed(() => store.state.now)
const width = computed(() => store.state.width)
const settings = computed(() => store.state.settings)
const userList = computed(() => store.state.userList)
const topTweetId = computed(() => store.state.topTweetId)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)

const tweetModeValue = computed(() => store.state.tweetMode)
const tweetTypeValue = computed(() => store.state.tweetType)

const translatorMode = computed(() => store.state.translatorMode)
const bookMarks = computed(() => store.state.bookmarks)

const updateBookMarks = (type: 'media' | 'tweet' = 'tweet') => {
  store.dispatch('updateBookMarks', {
    cleanAll: false,
    tweet: {
      type,
      tweet_id: props.tweet?.tweet_id_str || '0',
      uid: props.tweet?.uid_str || '0',
      name: props.tweet?.name || '',
      display_name: props.tweet?.display_name || '',
      text: props.tweet?.full_text_origin || '',
      entities: props.tweet?.entities,
      media: props.tweet?.mediaObject?.map(media => ({
        is_video: media.extension === 'mp4',
        url: media.url,
        cover: media.cover,
        size: media.origin_info_width/media.origin_info_height//TODO aspect ratio
      })) || [],
      timestamp: props.tweet?.time || 0,
      add_timestamp: String(Number(new Date())),
    }
  })
}

const swapDisplayPictureStatus = () => {
  store.dispatch('swapDisplayPictureStatus')
}

const timeGap = (timestamp: number, now: number, language: string) => {
  let gap = (now - (timestamp * 1000))/1000;
  if (gap < 60) {
    return Math.floor(gap) + ' ' + t("public.time.second", Math.floor(gap) === 1 ? 1 : 2);
  } else if (gap < 3600) {
    return Math.floor(gap/60) + ' ' + t("public.time.minute", Math.floor(gap/60) === 1 ? 1 : 2);
  } else if (gap < 86400) {
    return Math.floor(gap/3600) + ' ' + t("public.time.hour", Math.floor(gap/3600) === 1 ? 1 : 2);
  } else {
    return (new Date(timestamp * 1000)).toLocaleString(language);
  }
}

const clickEvent = (e: Event) => {
  let selectionObject = window.getSelection()
  if (route.params.status !== props.tweet.tweet_id_str && selectionObject && selectionObject.isCollapsed) {
    if (route.name !== 'name-status' || route.params.status !== props.tweet.tweet_id_str) {
      router.push(`/`+ `i/status/` + props.tweet.tweet_id_str)
    }
  }
}

const tweetItem = ref<HTMLElement>()
const verifiedStatus = computed(() => VerifiedStatus(settings.value.onlineMode ? (props.tweet.retweet_from_name ? props.tweet?.retweet_user_info?.verified||0 : props.tweet?.user_info?.verified||0) : 0))


onMounted(() => {
  if (route.name === 'no-name-status' && route.params.status === props.tweet.tweet_id_str) {
    request<ApiUserInfo>(settings.value.basePath + '/api/v3/data/userinfo/?uid=' + props.tweet.uid_str).then(response => {
      if (response.code === 200) {
        router.replace({path: '/' + response.data.name + '/status/' + props.tweet.tweet_id_str})
      } else {
        router.replace({path: '/' + props.tweet.name + '/status/' + props.tweet.tweet_id_str})
      }
    }).catch(e => {
      Notice(String(e), 'error')
    })
  }
})


</script>
