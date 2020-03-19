<template>
    <div id="imageList">
        <div v-if="is_video === '1'">
            <video :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[0].url" :poster="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[0].cover" :type="list[0].content_type" preload="none" controls muted playsinline loop width="100%" id="videoPlayer"></video>
        </div>
        <div v-else-if="list.length > 1">
            <el-image class="rounded img-thumbnail" v-for="(media, s) in list" :key="media.tweet_id+s" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +media.url+':thumb'" lazy style="width: 180px; height: 180px" fit="cover" :preview-src-list="previewList" :preview-src-list-order="s" :alt="media.uid+'_'+media.tweet_id+'_'+s">
                <div slot="error" class="image-slot"></div>
                <div slot="placeholder" class="image-slot">
                    <!--此处可写死-->
                    <div style="height: 180px" v-loading="true" />
                </div>
            </el-image>
        </div>
        <div v-else :class="(bottom ? '' : 'card')">
            <el-image :class="`rounded card-img` + (bottom ? '-bottom' : '-top')" v-for="(media, s) in list" :key="media.tweet_id+s" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +media.url" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="s" :alt="media.uid+'_'+media.tweet_id+'_'+s">
                <div slot="error" class="image-slot"></div>
                <div slot="placeholder" class="image-slot" >
                    <!--此处待新操作 //TODO-->
                    <div v-loading="true" style="height: 180px" />
                </div>
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
            basePath: String,
            bottom: {
                type: Boolean,
                default: false
            },
            online: {
                type: Boolean,
                default: false,
            }
        },
        computed: {
            previewList: function () {
                return this.list.map(s => this.basePath+(this.online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') + s.url + ':large');
            }
        }
    }
</script>

<style scoped>

</style>
