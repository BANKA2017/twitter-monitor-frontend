<template>
    <div id="tweet">
        <div :id="tweet.tweet_id_str"
             :class="{'card': true, 'card-border': true, 'border-danger': tweet.dispute === 1, 'border-primary': tweet.tweet_id_str === top}">
          <div class='card-body'>
            <p v-if="displayType === 'timeline' && tweet.tweet_id_str === top"><small class="text-muted">置顶推文</small></p>
            <p v-if="tweet.dispute === 1"><small class="text-muted"><i class="el-icon-warning"></i> 这是一条有争议的推文
              <router-link to="/about">了解更多</router-link>
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
                <template>
                  <router-link
                      v-if="!tweet.retweet_from_name || (tweet.retweet_from_name && $root.userList.map(x => x.name).includes(tweet.retweet_from_name))"
                      :to="`/`+ (tweet.retweet_from ? tweet.retweet_from_name : tweet.name) + (tweet.retweet_from_name && tweet.retweet_from_name !== tweet.name ? '/all' : displayType === 'status' ? `/` + display : `/status/`+tweet.tweet_id_str)"
                      class="card-title text-dark">
                    {{ tweet.retweet_from ? tweet.retweet_from : tweet.display_name }}
                  </router-link>
                  <a v-else :href="`//twitter.com/` + tweet.retweet_from_name" class="text-dark"
                     target="_blank">{{ tweet.retweet_from }}</a>
                    | <small>@{{ tweet.retweet_from ? tweet.retweet_from_name : tweet.name }}</small>
                </template>
                <!--media-->
                <span @click="$root.settings.data.displayPicture=!$root.settings.data.displayPicture"
                      v-if="tweet.media === 1" style="cursor:pointer">
                    <image-icon height="2em" status="text-success" width="2em"/>
                </span>
                <camera-video-icon v-if="tweet.video === 1" height="2em" status="text-danger" width="2em"/>
                <a :href="`//twitter.com/i/status/`+tweet.tweet_id_str" target="_blank">
                    <box-arrow-up-right height="2em" status="text-primary" width="2em"/>
                </a>
                <div class="my-4"></div>
                <!--<div v-html="`<p class='card-text'>`+tweet.full_text+`</p>`"></div>-->
                <!--excited!-->
                <html-text :entities="tweet.entities" :full_text_origin="tweet.full_text_origin"/>
              <translate v-if="order !== -1" :id="tweet.tweet_id_str" :order="order" :to="$root.settings.data.language"
                         :type="0"/>
                <!--media-->
                <template v-if="tweet.media === 1&&!$root.settings.data.displayPicture">
                    <div class="my-4"></div>
                    <image-list :is_video="tweet.video" :list="tweet.mediaObject.tweetsMedia"
                                :unlimited="displayType === 'status'"/>
                </template>
                <!--quote-->
                <template v-if="tweet.quote_status !== 0">
                    <div class="my-4"></div>
                    <quote-card :base-path="basePath" :display-picture="$root.settings.data.displayPicture"
                                :language="$root.settings.data.language" :quote-media="tweet.mediaObject.quoteMedia"
                                :quote-object="tweet.quoteObject"/>
                </template>
                <!--polls-->
                <template v-if="tweet.poll === 1">
                    <tw-polls :language="$root.settings.data.language" :media="tweet.mediaObject.cardMedia"
                              :polls="tweet.pollObject" :tweet_id="tweet.tweet_id_str"/>
                </template>
                <!--card-->
                <template v-else-if="tweet.card !== ''">
                    <div class="my-4"></div>
                    <tw-card :media="tweet.mediaObject.cardMedia" :mediaState="!$root.settings.data.displayPicture"
                             :object="tweet.cardObject" :tweet-text="tweet.full_text_origin.split(`\n`)[0]" :user-name="tweet.retweet_from ? tweet.retweet_from : tweet.display_name"></tw-card>
                </template>
                <!--time && source-->
                <div id="foot">
                    <small class="text-muted">{{ timeGap(tweet.time, $root.now, $root.settings.data.language) }} · <span
                            style="color: #1DA1F2">{{ tweet.source }}</span></small>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ImageIcon from "../icons/imageIcon";
    import CameraVideoIcon from "../icons/cameraVideoIcon";
    import BoxArrowUpRight from "../icons/boxArrowUpRight";
    import HtmlText from "./htmlText";
    import Translate from "./translate";
    import ImageList from "./imageList";
    import QuoteCard from "./quoteCard";
    import TwPolls from "./twPolls";
    import TwCard from "./twCard";
    import Retweet from "../icons/retweet";

    export default {
        name: "tweet",
        components: {
            Retweet,
            TwCard, TwPolls, QuoteCard, ImageList, Translate, HtmlText, BoxArrowUpRight, CameraVideoIcon, ImageIcon
        },
        props: {
          top: {
            type: [Number, String],
            default: 0
          },
          displayType: String,
          tweet: Object,
          display: String,
          order: {
            type: Number,
            default: -1
          },
        },
        methods: {
            timeGap: function (timestamp, now, language) {
                let gap = (now - (timestamp * 1000)) / 1000;
                if (gap < 60) {
                    return Math.floor(gap) + '秒';
                } else if (gap < 3600) {
                    return Math.floor(gap / 60) + '分钟';
                } else if (gap < 86400) {
                    return Math.floor(gap / 3600) + '小时';
                } else {
                    return (new Date(timestamp * 1000)).toLocaleString(language);
                }
            },
        }
    }
</script>

<style scoped>

</style>
