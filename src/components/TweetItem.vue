<template>
  <div id="tweet">
    <div v-if="false">{{ tweet }}</div>
    <div v-else :id="tweet.tweet_id_str" :class="{'card': true, 'card-border': true, 'border-danger': tweet.dispute === 1, 'border-primary': tweet.tweet_id_str === topTweetId || (settings.loadConversation && $route.name === 'name-status' && $route.params.status === tweet.tweet_id_str)}">
      <div class='card-body'>
        <p v-if="tweetModeValue === 'timeline' && tweet.tweet_id_str === topTweetId"><small class="text-muted">{{ t("tweet.text.pinned_tweet") }}</small></p>
        <p v-if="tweet.dispute === 1"><small class="text-muted"><exclamation-circle height="1em" status="" width="1em" /> {{ t("tweet.text.this_is_a_dispute_tweet") }}
          <router-link to="/about">{{ t("tweet.text.learn_more") }}</router-link>
        </small></p>
        <div>
          <small class="text-muted" v-if="tweet.retweet_from">
            <retweet height="1em" status="" width="1em"/>
            <router-link :to="`/`+(tweetModeValue === 'status' ? tweet.name + `/all` : `i/status/`+tweet.tweet_id_str)" class="text-muted">
              <full-text :entities="[]" :full_text_origin="tweet.display_name" />
            </router-link>
          </small>
        </div>
        <router-link v-if="settings.onlineMode || !tweet.retweet_from_name || (tweet.retweet_from_name && userList.map(x => x.name).includes(tweet.retweet_from_name))" :to="`/`+ (tweetModeValue === 'status' ? ((tweet.retweet_from_name && tweet.retweet_from_name === tweet.name) ? `i/status/`+tweet.tweet_id_str : ((tweet.retweet_from ? tweet.retweet_from_name : tweet.name) + '/all')) : `i/status/`+tweet.tweet_id_str)" class="card-title text-dark">
          <full-text :entities="[]" :full_text_origin="tweet.retweet_from ? tweet.retweet_from : tweet.display_name" />
        </router-link>
        <a v-else :href="`//twitter.com/` + tweet.retweet_from_name" class="text-dark" target="_blank"><full-text :entities="[]" :full_text_origin="tweet.retweet_from" /></a>
        | <small>@{{ tweet.retweet_from ? tweet.retweet_from_name : tweet.name }}</small>
        <!--media-->
        <span v-if="tweet.media === 1" class="ms-1" style="cursor:pointer" @click="swapDisplayPictureStatus">
          <image-icon height="2em" status="text-success" width="2em"/>
        </span>
        <camera-video-icon v-if="tweet.video === 1" height="2em" status="text-danger" width="2em"/>
        <a :href="`//twitter.com/i/status/`+tweet.tweet_id_str" target="_blank">
          <box-arrow-up-right height="2em" status="text-primary" width="2em"/>
        </a>
        <!--save for image-->
        <!--<span role="button" @click="h2c">gggg</span>-->
        <div class="my-4"></div>
        <!--<div v-html="`<p class='card-text'>`+tweet.full_text+`</p>`"></div>-->
        <!--excited!-->
        <full-text class="card-text" :entities="tweet.entities" :full_text_origin="tweet.full_text_origin"/>
        <translate v-if="!settings.onlineMode && tweet.full_text_origin" :id="tweet.tweet_id_str" :to="settings.language" type="0"/>
        <!--media-->
        <template v-if="tweet.media === 1&&!settings.displayPicture && tweet.mediaObject.filter(x => x.source === 'tweets').length">
          <div class="my-4"></div>
          <image-list :is_video="tweet.video" :list="tweet.mediaObject.filter(x => x.source === 'tweets')" :unlimited="tweetModeValue === 'status'"/>
        </template>
        <!--quote-->
        <template v-if="tweet.quote_status !== 0">
          <div class="my-4"></div>
          <quote-card :quote-media="tweet.mediaObject.filter(x => x.source === 'quote_status')" :quote-object="tweet.quoteObject"/>
        </template>
        <!--polls-->
        <template v-if="tweet.poll !== 0">
          <tw-polls :media="tweet.mediaObject.filter(x => x.source === 'cards')" :polls="tweet.pollObject"/>
        </template>
        <!--card-->
        <template v-else-if="tweet.card !== '' && Object.keys(tweet.cardObject).length">
          <div class="my-4"></div>
          <tw-card :media="tweet.mediaObject.filter(x => x.source === 'cards')" :mediaState="!settings.displayPicture" :object="tweet.cardObject" :tweet-text="tweet.full_text_origin.split(`\n`)[0]" :user-name="tweet.retweet_from ? tweet.retweet_from : tweet.display_name"></tw-card>
        </template>
        <!--time && source-->
        <div id="foot">
          <small class="text-muted">{{ timeGap(tweet.time, now, settings.language) }} · <span style="color: #1DA1F2">{{ tweet.source }}</span></small>
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
import Retweet from "@/icons/Retweet.vue";
import ImageIcon from "@/icons/ImageIcon.vue";
import CameraVideoIcon from "@/icons/CameraVideoIcon.vue";
import BoxArrowUpRight from "@/icons/BoxArrowUpRight.vue";
import ExclamationCircle from "@/icons/ExclamationCircle.vue";
import {useStore} from "@/store";
import {computed, onMounted, PropType} from "vue";
import {useI18n} from "vue-i18n";
import {Tweet} from "@/type/Content";
import {useRoute, useRouter} from "vue-router";
import {request} from "@/share/Fetch";
import {ApiUserInfo} from "@/type/Api";
import {Notice} from "@/share/Tools";
//import html2canvas from 'html2canvas';

const props = defineProps({
  tweet: {
    type: Object as PropType<Tweet>,
    default: () => ({})
  },
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useStore()
const now = computed(() => store.state.now)
const settings = computed(() => store.state.settings)
const userList = computed(() => store.state.userList)
const topTweetId = computed(() => store.state.topTweetId)

const tweetModeValue = computed(() => store.state.tweetMode)
const tweetTypeValue = computed(() => store.state.tweetType)

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

onMounted(() => {
  if (route.name === 'no-name-status' && route.params.status === props.tweet.tweet_id_str) {
    request<ApiUserInfo>(settings.value.basePath + '/api/v2/data/userinfo/?uid=' + props.tweet.uid_str).then(response => {
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

//h2c: function () {
//  html2canvas(document.getElementById(this.tweet.tweet_id_str), {useCORS: true}).then(function(canvas) {
//    document.body.appendChild(canvas);
//  });
//}

</script>

<style scoped>

</style>
