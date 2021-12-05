<template>
    <div class="no-gutters card" id="quote" style="border-radius: 14px 14px 14px 14px">
        <div class='card-body'>
            <span class="card-text" v-if="!quoteObject.full_text">{{ $t("quote_card.card.this_tweet_is_not_available") }}</span>
            <template v-else>
                <div>
                    <span class="text-muted">{{ quoteObject.display_name }}</span>
                    <el-divider direction="vertical"></el-divider>
                    <small>@{{ quoteObject.name }}</small>
                    <a :href="`//twitter.com/i/status/`+quoteObject.tweet_id" target="_blank">
                        <box-arrow-up-right status="text-primary" width="2em" height="2em" />
                    </a>
                </div>
                <div class="my-4"></div>
                <p class='card-text' ref="quote_text">{{ quoteObject.full_text }}</p>
                <div id="quotefoot">
                    <small class="text-muted">{{ timeGap(quoteObject.time, now, language) }}</small>
                </div>
                <!--media-->
                <template v-if="quoteObject.media === 1&&!displayPicture">
                    <div class="my-4"></div>
                    <image-list :basePath="settings.data.basePath" :bottom="true" :is_video="quoteObject.video" :list="quoteMedia"/>
                </template>
            </template>
        </div>
    </div>
</template>

<script>
    import ImageList from "./imageList";
    import {mapState} from "vuex";
    import BoxArrowUpRight from "@/components/icons/boxArrowUpRight";
    //import twemoji from "twemoji";
    export default {
        name: "quoteCard",
        components: {BoxArrowUpRight, ImageList},
        props: {
            quoteObject: Object,
            quoteMedia: Array,
            displayPicture: Boolean,
            language: String,
        },
      computed: mapState({
        now: 'now',
        settings: 'settings',
      }),
        //watch: {
        //  "quoteObject.full_text": {
        //    deep: true,
        //    handler: function () {
        //      this.emojiParse()
        //    }
        //  }
        //},
        //mounted: function () {
        //  this.emojiParse()
        //},
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
            //emojiParse: function () {
            //  twemoji.parse(this.$refs.quote_text, {
            //    ext: '.svg',
            //    folder: 'svg',
            //    base: this.twemojiBasePath,
            //    attributes: () => ({style: "height: 1em;width: 1em;margin: 0.05em 0.1em;vertical-align: -0.1em;",})
            //  })
            //}
        }
    }
</script>

<style scoped>

</style>
