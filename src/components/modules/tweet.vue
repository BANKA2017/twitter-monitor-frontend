<template>
    <div id="tweet">
      <div v-if="false">
        {{ tweet }}
      </div>
        <div v-else :id="tweet.tweet_id_str"
             :class="{'card': true, 'card-border': true, 'border-danger': tweet.dispute === 1, 'border-primary': tweet.tweet_id_str === top}">
          <div class='card-body'>
            <p v-if="displayType === 'timeline' && tweet.tweet_id_str === top"><small class="text-muted">{{ $t("tweet.text.pinned_tweet") }}</small></p>
            <p v-if="tweet.dispute === 1"><small class="text-muted"><exclamation-circle height="1em" status="" width="1em" /> {{ $t("tweet.text.this_is_a_dispute_tweet") }}
              <router-link to="/about">{{ $t("tweet.text.learn_more") }}</router-link>
            </small></p>
            <div>
              <small class="text-muted" v-if="tweet.retweet_from">
                <retweet height="1em" status="" width="1em"/>
                <router-link
                    :to="`/`+tweet.name+(displayType === 'status' ? `/` + display : `/status/`+tweet.tweet_id_str)"
                    class="text-muted">
                  {{ tweet.display_name }}
                </router-link>
              </small>
            </div>
                <router-link
                    v-if="!tweet.retweet_from_name || (tweet.retweet_from_name && userList.map(x => x.name).includes(tweet.retweet_from_name))"
                    :to="`/`+ (tweet.retweet_from ? tweet.retweet_from_name : tweet.name) + (tweet.retweet_from_name && tweet.retweet_from_name !== tweet.name ? '/all' : displayType === 'status' ? `/` + display : `/status/`+tweet.tweet_id_str)"
                    class="card-title text-dark">
                  {{ tweet.retweet_from ? tweet.retweet_from : tweet.display_name }}
                </router-link>
                <a v-else :href="`//twitter.com/` + tweet.retweet_from_name" class="text-dark"
                   target="_blank">{{ tweet.retweet_from }}</a>
                  | <small>@{{ tweet.retweet_from ? tweet.retweet_from_name : tweet.name }}</small>
                <!--media-->
                <span v-if="tweet.media === 1"
                      class="ml-1" style="cursor:pointer" @click="swapDisplayPictureStatus">
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
                <html-text :entities="tweet.entities" :full_text_origin="tweet.full_text_origin"/>
                <translate v-if="order !== -1 && tweet.full_text_origin" :id="tweet.tweet_id_str" :order="order" :to="settings.data.language"
                         :type="0"/>
                <!--media-->
                <template v-if="tweet.media === 1&&!settings.data.displayPicture && tweet.mediaObject.tweetsMedia.length">
                    <div class="my-4"></div>
                    <image-list :is_video="tweet.video" :list="tweet.mediaObject.tweetsMedia"
                                :unlimited="displayType === 'status'"/>
                </template>
                <!--quote-->
                <template v-if="tweet.quote_status !== 0">
                    <div class="my-4"></div>
                    <quote-card :base-path="settings.data.basePath" :display-picture="settings.data.displayPicture"
                                :language="settings.data.language" :quote-media="tweet.mediaObject.quoteMedia"
                                :quote-object="tweet.quoteObject"/>
                </template>
                <!--polls-->
                <template v-if="tweet.poll !== 0">
                    <tw-polls :language="settings.data.language" :media="tweet.mediaObject.cardMedia"
                              :polls="tweet.pollObject" :tweet_id="tweet.tweet_id_str"/>
                </template>
                <!--card-->
                <template v-else-if="tweet.card !== '' && Object.keys(tweet.cardObject).length">
                    <div class="my-4"></div>
                    <tw-card :media="tweet.mediaObject.cardMedia" :mediaState="!settings.data.displayPicture"
                             :object="tweet.cardObject" :tweet-text="tweet.full_text_origin.split(`\n`)[0]" :user-name="tweet.retweet_from ? tweet.retweet_from : tweet.display_name"></tw-card>
                </template>
                <!--time && source-->
                <div id="foot">
                    <small class="text-muted">{{ timeGap(tweet.time, now, settings.data.language) }} · <span
                            style="color: #1DA1F2">{{ tweet.source }}</span></small>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import HtmlText from "./htmlText";
    import Translate from "./translate";
    import ImageList from "./imageList";
    import QuoteCard from "./quoteCard";
    import TwPolls from "./twPolls";
    import TwCard from "./twCard";
    import Retweet from "../icons/retweet";
    import {mapState} from "vuex";
    import ImageIcon from "@/components/icons/imageIcon";
    import CameraVideoIcon from "@/components/icons/cameraVideoIcon";
    import BoxArrowUpRight from "@/components/icons/boxArrowUpRight";
    import ExclamationCircle from "@/components/icons/exclamationCircle";
    //import html2canvas from 'html2canvas';

    export default {
        name: "tweet",
        components: {
          ExclamationCircle,
          BoxArrowUpRight,
          CameraVideoIcon,
          ImageIcon,
            Retweet,
            TwCard, TwPolls, QuoteCard, ImageList, Translate, HtmlText
        },
        props: {
          top: {
            type: [Number, String],
            default: 0
          },
          displayType: String,
          tweet: {
            type: Object,
            default: () => ({})
          },
          display: String,
          order: {
            type: Number,
            default: -1
          },
        },
        computed: mapState({
          now: 'now',
          settings: 'settings',
          userList: 'userList',
        }),
        methods: {
          timeGap: function (timestamp, now, language) {
            let gap = (now - (timestamp * 1000))/1000;
            if (gap < 60) {
              return Math.floor(gap) + ' ' + this.$tc("public.time.second", Math.floor(gap) === 1 ? 1 : 2);
            } else if (gap < 3600) {
              return Math.floor(gap/60) + ' ' + this.$tc("public.time.minute", Math.floor(gap/60) === 1 ? 1 : 2);
            } else if (gap < 86400) {
              return Math.floor(gap/3600) + ' ' + this.$tc("public.time.hour", Math.floor(gap/3600) === 1 ? 1 : 2);
            } else {
              return (new Date(timestamp * 1000)).toLocaleString(language);
            }
          },
          swapDisplayPictureStatus: function () {
            this.$store.dispatch('swapDisplayPictureStatus')
          }
          //h2c: function () {
          //  html2canvas(document.getElementById(this.tweet.tweet_id_str), {useCORS: true}).then(function(canvas) {
          //    document.body.appendChild(canvas);
          //  });
          //}
        }
    }
</script>

<style scoped>

</style>
