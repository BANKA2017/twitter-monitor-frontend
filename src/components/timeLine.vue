<template>
    <div id="timeLine">
        <template v-for="(tweet, tweet_id) in tweets">
            <div class="card card-border" :id="tweet.tweet_id" :key="tweet.tweet_id">
                <div class='card-body'>
                    <template>
                        <small v-if="tweet.retweeted_status_id_str" class="text-muted">
                            <retweet status="" width="1em" height="1em"/>
                            <span class="text-muted">
                                {{ tweet.retweeted_status_id_str }}
                            </span>
                        </small>
                    </template>
                    <a :href="`//twitter.com/i/status/`+tweet_id" target="_blank">
                        <box-arrow-up-right status="text-primary" width="2em" height="2em" />
                    </a>
                    <div class="my-4"></div>
                    <p class='card-text'>{{ tweet.full_text }}</p>
                    <!--media-->
                    <template v-if="tweet.entities.media">
                        <div class="my-4"></div>
                        <image-list :list="tweetsMedia(tweet_id, tweet.entities.media)" :is_video="'0'" :basePath="basePath" :online="true" />
                    </template>
                    <!--quote-->
                    <!--<template v-if="tweet.quote_status !== '0'">
                        <div class="my-4"></div>
                        <quote-card :quote-object="tweet.quoteObject" :quote-media="tweet.mediaObject.quoteMedia" :base-path="basePath" :display-picture="settings.data.displayPicture" :language="settings.data.language" />
                    </template>-->
                    <!--polls-->
                    <!--<template v-if="tweet.poll === '1'">
                        <tw-polls :polls="tweet.pollObject" :tweet_id="tweet.tweet_id" :language="settings.data.language" :media="tweet.mediaObject.cardMedia" :basePath="basePath" />
                    </template>-->
                    <!--card-->
                    <!--<template v-else-if="tweet.card !== ''">
                        <div class="my-4"></div>
                        <tw-card :object="tweet.cardObject" :media="tweet.mediaObject.cardMedia" :mediaState="!settings.data.displayPicture" :basePath="basePath"></tw-card>
                    </template>-->
                    <!--time && source-->
                    <div id="foot">
                        <small class="text-muted">{{ tweet.created_at }}</small>
                    </div>
                </div>
            </div>
            <hr class="my-4" :key="tweet.tweet_id">
        </template>
    </div>
</template>

<script>
    import axios from "axios";
    import Retweet from "./icons/retweet";
    import BoxArrowUpRight from "./icons/boxArrowUpRight";
    import ImageList from "./imageList";

    export default {
        name: "timeLine",
        components: {ImageList, BoxArrowUpRight, Retweet},
        props: {
            displayType: String,
            uid: String,
            basePath: String,
        },
        data() {
            return {
                tweets: {},
                bottomCursor: "",
                topCursor: "",
                load: true,
            }
        },
        watch: {
            "uid": function () {
                if (this.uid !== '0')
                this.load = true;
                this.update();
            }
        },
        mounted() {
            this.load = true;
            this.update();
        },
        methods: {
            notice: function (text, status) {
                this.$parent.notice(text, status);
            },
            tweetsMedia: function (tweet_id, obj) {
                return obj.map(media => {return {uid: this.uid, tweet_id: tweet_id, url: media.media_url_https.substr(8)}});
            },
            update: function () {
                axios.get(this.basePath + "/api/v2/online/timeline/?uid=" + this.uid).then(response => {
                    this.tweets = response.data.data.globalObjects.tweets;
                    //this.moreTweets = response.data.data.hasmore;
                    //this.topTweetId = response.data.data.top_tweet_id;
                    //this.bottomTweetId = response.data.data.bottom_tweet_id;
                    this.load = false;
                    //this.reload = response.data.code !== 200;
                }).catch(error => {
                    this.notice(error, 'error');
                    this.load = false;
                    //this.reload = true;
                })
            },
        }
    }
</script>

<style scoped>

</style>
