<template>
    <div id="imageList">
        <div v-if="is_video === '1'">
            <div class="row no-gutters">
                <video class="col-12 border" style="max-height: 300px; border-radius: 10px 10px 10px 10px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[0].url" :poster="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[0].cover" :type="list[0].content_type" preload="none" controls muted playsinline loop id="videoPlayer"></video>
            </div>
        </div>
        <div v-else-if="list.length === 1">
            <div class="row no-gutters">
                <el-image class="col-12 border" style="height: 300px; border-radius: 10px 10px 10px 10px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[0].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="0" :alt="list[0].uid+'_'+list[0].tweet_id+'_'+0"></el-image>
            </div>
        </div>
        <div v-else-if="list.length === 2">
            <div class="row no-gutters">
                <el-image class="col-6 border" style="height: 300px; border-radius: 10px 0 0 10px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[0].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="0" :alt="list[0].uid+'_'+list[0].tweet_id+'_'+0"></el-image>
                <el-image class="col-6 border" style="height: 300px; border-radius: 0 10px 10px 0" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[1].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="1" :alt="list[1].uid+'_'+list[1].tweet_id+'_'+1"></el-image>
            </div>
        </div>
        <div v-else-if="list.length === 3">
            <div class="row no-gutters">
                <el-image class="col-6 border" style="height: 300px; border-radius: 10px 0 0 10px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[0].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="0" :alt="list[0].uid+'_'+list[0].tweet_id+'_'+0"></el-image>
                <div class="col-6">
                    <div class="row no-gutters">
                        <el-image class="col-12 border" style="height: 150px; border-top-right-radius: 10px 10px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[1].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="1" :alt="list[1].uid+'_'+list[1].tweet_id+'_'+1"></el-image>
                        <el-image class="col-12 border" style="height: 150px; border-bottom-right-radius: 10px 10px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[2].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="2" :alt="list[2].uid+'_'+list[2].tweet_id+'_'+2"></el-image>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="list.length === 4">
            <div class="row no-gutters">
                <div class="col-6">
                    <div class="row no-gutters">
                        <el-image class="col-12 border" style="height: 150px; border-top-left-radius: 10px 10px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[0].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="0" :alt="list[0].uid+'_'+list[0].tweet_id+'_'+0"></el-image>
                        <el-image class="col-12 border" style="height: 150px; border-bottom-left-radius: 10px 10px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[1].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="1" :alt="list[1].uid+'_'+list[1].tweet_id+'_'+1"></el-image>
                    </div>
                </div>
                <div class="col-6">
                    <div class="row no-gutters">
                        <el-image class="col-12 border" style="height: 150px; border-top-right-radius: 10px 10px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[2].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="2" :alt="list[2].uid+'_'+list[2].tweet_id+'_'+2"></el-image>
                        <el-image class="col-12 border" style="height: 150px; border-bottom-right-radius: 10px 10px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[3].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="3" :alt="list[3].uid+'_'+list[3].tweet_id+'_'+3"></el-image>
                    </div>
                </div>
            </div>
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
