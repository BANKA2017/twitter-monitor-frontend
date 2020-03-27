<template>
    <div id="imageList">
        <div v-if="is_video === '1'">
            <div :class="`no-gutters embed-responsive embed-responsive-` + (list[0].origin_info_width / list[0].origin_info_height < 16 / 9 ? '4by3' : '16by9')">
                <video class="border" style="width: 100%; height: 100%; border-radius: 14px 14px 14px 14px; background-color: black" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[0].url" :poster="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[0].cover" :type="list[0].content_type" preload="none" controls muted playsinline loop id="videoPlayer"></video>
            </div>
        </div>
        <div v-else-if="list.length === 1">
            <div class="no-gutters card" :style="`width: 100%; padding-bottom: ` + (list[0].origin_info_width / list[0].origin_info_height > 16 / 9 ? list[0].origin_info_height / list[0].origin_info_width * 100 : 56.25) +  `%; height: 0; border-radius: 14px 14px 14px 14px`">
                <el-image class="border border-white" style="width: 100%; height: 100%; position: absolute; border-radius: 14px 14px 14px 14px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[0].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="0" :alt="list[0].uid+'_'+list[0].tweet_id+'_'+0"></el-image>
            </div>
        </div>
        <div v-else-if="list.length === 2">
            <div class="card no-gutters" style="width: 100%; padding-bottom: 56.25%; height: 0; border-radius: 14px 14px 14px 14px">
                <el-image class="border border-white" style="width: 50%; height: 100%; position: absolute; border-radius: 14px 0 0 14px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[0].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="0" :alt="list[0].uid+'_'+list[0].tweet_id+'_'+0"></el-image>
                <el-image class="border border-white" style="width: 50%; height: 100%; margin-left: 50%; position: absolute; border-radius: 0 14px 14px 0" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[1].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="1" :alt="list[1].uid+'_'+list[1].tweet_id+'_'+1"></el-image>
            </div>
        </div>
        <div v-else-if="list.length === 3">
            <div class="card no-gutters" style="width: 100%; padding-bottom: 56.25%; height: 0; border-radius: 14px 14px 14px 14px">
                <el-image class="border border-white" style="width: 50%; height: 100%; position: absolute; border-radius: 14px 0 0 14px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[0].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="0" :alt="list[0].uid+'_'+list[0].tweet_id+'_'+0"></el-image>
                <el-image class="border border-white" style="width: 50%; height: 50%; margin-left: 50%; position: absolute; border-top-right-radius: 14px 14px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[1].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="1" :alt="list[1].uid+'_'+list[1].tweet_id+'_'+1"></el-image>
                <el-image class="border border-white" style="width: 50%; height: 50%; margin-left: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-right-radius: 14px 14px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[2].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="2" :alt="list[2].uid+'_'+list[2].tweet_id+'_'+2"></el-image>
            </div>
        </div>
        <div v-else-if="list.length === 4">
            <div class="card no-gutters" style="width: 100%; padding-bottom: 56.25%; height: 0; border-radius: 14px 14px 14px 14px">
                <el-image class="border border-white" style="width: 50%; height: 50%; position: absolute; border-top-left-radius: 14px 14px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[0].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="0" :alt="list[0].uid+'_'+list[0].tweet_id+'_'+0"></el-image>
                <el-image class="border border-white" style="width: 50%; height: 50%; margin-left: 50%; position: absolute; border-top-right-radius: 14px 14px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[1].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="1" :alt="list[1].uid+'_'+list[1].tweet_id+'_'+1"></el-image>
                <el-image class="border border-white" style="width: 50%; height: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-left-radius: 14px 14px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[2].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="2" :alt="list[2].uid+'_'+list[2].tweet_id+'_'+2"></el-image>
                <el-image class="border border-white" style="width: 50%; height: 50%; margin-left: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-right-radius: 14px 14px" :src="basePath+(online ? '/api/v2/online/media/?url=' : '/api/v2/media/tweets/') +list[3].url+':small'" lazy fit="cover" :preview-src-list="previewList" :preview-src-list-order="3" :alt="list[3].uid+'_'+list[3].tweet_id+'_'+3"></el-image>
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
