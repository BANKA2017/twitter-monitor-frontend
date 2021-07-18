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
                <p class='card-text'>{{ quoteObject.full_text }}</p>
                <div id="quotefoot">
                    <small class="text-muted">{{ timeGap(quoteObject.time, $root.now, language) }}</small>
                </div>
                <!--media-->
                <template v-if="quoteObject.media === 1&&!displayPicture">
                    <div class="my-4"></div>
                    <image-list :list="quoteMedia" :is_video="quoteObject.video" :basePath="basePath" :bottom="true"/>
                </template>
            </template>
        </div>
    </div>
</template>

<script>
    import BoxArrowUpRight from "../icons/boxArrowUpRight";
    import ImageList from "./imageList";
    export default {
        name: "quoteCard",
        components: {ImageList, BoxArrowUpRight},
        props: {
            quoteObject: Object,
            quoteMedia: Array,
            displayPicture: Boolean,
            language: String,
        },
        methods: {
            timeGap: function (timestamp, now, language) {
                let gap = (now - (timestamp * 1000))/1000;
                if (gap < 60) {
                    return Math.floor(gap) + this.$tc("quote_card.time.second", Math.floor(gap) === 1 ? 0 : 1);
                } else if (gap < 3600) {
                    return Math.floor(gap/60) + this.$tc("quote_card.time.minute", Math.floor(gap/60) === 1 ? 0 : 1);
                } else if (gap < 86400) {
                    return Math.floor(gap/3600)  + this.$tc("quote_card.time.hour", Math.floor(gap/3600) === 1 ? 0 : 1);
                } else {
                    return (new Date(timestamp * 1000)).toLocaleString(language);
                }
            },
        }
    }
</script>

<style scoped>

</style>
