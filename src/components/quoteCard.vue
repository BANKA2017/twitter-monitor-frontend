<template>
    <div class="container" id="quote">
        <div class="card mb-3">
            <div class='card-body'>
                <span class="card-text" v-if="!quoteObject.full_text">这条推文不可用。</span>
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
                    <div v-html="`<p class='card-text'>`+quoteObject.full_text+`</p>`"></div>
                    <div id="quotefoot">
                        <small class="text-muted">{{ timeGap(quoteObject.time, now, language) }}</small>
                    </div>
                    <!--media-->
                    <template v-if="quoteObject.media === '1'&&!displayPicture">
                        <div class="my-4"></div>
                        <image-list :list="quoteMedia" :is_video="quoteObject.video" :basePath="basePath" :bottom="true"/>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import BoxArrowUpRight from "./icons/boxArrowUpRight";
    import ImageList from "./imageList";
    export default {
        name: "quoteCard",
        components: {ImageList, BoxArrowUpRight},
        props: {
            basePath: String,
            quoteObject: Object,
            quoteMedia: Array,
            displayPicture: Boolean,
            language: String,
            now: Date,
        },
        methods: {
            timeGap: function (timestamp, now, language) {
                let gap = (now - (timestamp * 1000))/1000;
                if (gap < 60) {
                    return gap + '秒';
                } else if (gap < 3600) {
                    return Math.floor(gap/60) + '分钟';
                } else if (gap < 86400) {
                    return Math.floor(gap/3600) + '小时';
                } else {
                    return (new Date(timestamp * 1000)).toLocaleString(language);
                }
            },
        }
    }
</script>

<style scoped>

</style>
