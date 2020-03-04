<template>
    <div id="imageList">
        <div v-if="is_video === '1'">
            <video :src="basePath+`/api/v2/media/tweets/`+list[0].url" :poster="basePath+`/api/v2/media/tweets/`+list[0].cover" :type="list[0].content_type" preload="none" controls muted playsinline loop width="100%" id="videoPlayer"></video>
        </div>
        <div v-else>
            <el-image class="rounded img-thumbnail" v-for="(media, s) in list" :key="media.tweet_id+s" :src="basePath+`/api/v2/media/tweets/`+media.url+''" lazy style="width: 180px; height: 180px" fit="cover" :preview-src-list="previewList" :alt="media.uid+'_'+media.tweet_id+'_'+s">
                <div slot="error" class="image-slot"></div>
            </el-image>
        </div>
    </div>
</template>

<script>
    export default {
        name: "imageList",
        props: {
            list: Array,
            is_video: String,
            basePath: String
        },
        computed: {
            previewList: function () {
                return this.list.map(s => this.basePath+'/api/v2/media/tweets/' + s.url + '');
            }
        }
    }
</script>

<style scoped>

</style>
