<template>
    <div id="imageList">
        <div v-if="is_video === '1'">
            <div :class="`no-gutters embed-responsive embed-responsive-` + (ratio < 16 / 9 ? (ratio < 4 / 3 ? '1by1' : '4by3') :ratio > 16 / 9 ? '21by9' : '16by9')">
                <video :poster="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[0].cover"
                       :preload="preload"
                       :type="list[0].content_type" class="border" controls id="videoPlayer" loop playsinline
                       :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[0].url"
                       style="width: 100%; height: 100%; border-radius: 14px 14px 14px 14px; background-color: black"></video>
            </div>
        </div>
        <div v-else-if="list.length === 1">
            <div :style="`width: 100%; padding-bottom: ` + ((unlimited || ratio > 16 / 9) ? list[0].origin_info_height / list[0].origin_info_width * 100 : 56.25) +  `%; height: 0; border-radius: 14px 14px 14px 14px`" class="no-gutters card">
                <el-image :alt="list[0].uid+'_'+list[0].tweet_id+'_'+0" :preview-src-list="previewList" :preview-src-list-order="0" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[0].url+':small'" class="border border-white" fit="cover" lazy style="width: 100%; height: 100%; position: absolute; border-radius: 14px 14px 14px 14px"></el-image>
            </div>
        </div>
        <div v-else-if="list.length === 2">
            <div class="card no-gutters" style="width: 100%; padding-bottom: 56.25%; height: 0; border-radius: 14px 14px 14px 14px">
                <el-image :alt="list[0].uid+'_'+list[0].tweet_id+'_'+0" :preview-src-list="previewList" :preview-src-list-order="0" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[0].url+':small'" class="border border-white" fit="cover" lazy style="width: 50%; height: 100%; position: absolute; border-radius: 14px 0 0 14px"></el-image>
                <el-image :alt="list[1].uid+'_'+list[1].tweet_id+'_'+1" :preview-src-list="previewList" :preview-src-list-order="1" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[1].url+':small'" class="border border-white" fit="cover" lazy style="width: 50%; height: 100%; margin-left: 50%; position: absolute; border-radius: 0 14px 14px 0"></el-image>
            </div>
        </div>
        <div v-else-if="list.length === 3">
            <div class="card no-gutters" style="width: 100%; padding-bottom: 56.25%; height: 0; border-radius: 14px 14px 14px 14px">
                <el-image :alt="list[0].uid+'_'+list[0].tweet_id+'_'+0" :preview-src-list="previewList" :preview-src-list-order="0" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[0].url+':small'" class="border border-white" fit="cover" lazy style="width: 50%; height: 100%; position: absolute; border-radius: 14px 0 0 14px"></el-image>
                <el-image :alt="list[1].uid+'_'+list[1].tweet_id+'_'+1" :preview-src-list="previewList" :preview-src-list-order="1" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[1].url+':small'" class="border border-white" fit="cover" lazy style="width: 50%; height: 50%; margin-left: 50%; position: absolute; border-top-right-radius: 14px 14px"></el-image>
                <el-image :alt="list[2].uid+'_'+list[2].tweet_id+'_'+2" :preview-src-list="previewList" :preview-src-list-order="2" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[2].url+':small'" class="border border-white" fit="cover" lazy style="width: 50%; height: 50%; margin-left: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-right-radius: 14px 14px"></el-image>
            </div>
        </div>
        <div v-else-if="list.length === 4">
            <div class="card no-gutters" style="width: 100%; padding-bottom: 56.25%; height: 0; border-radius: 14px 14px 14px 14px">
                <el-image :alt="list[0].uid+'_'+list[0].tweet_id+'_'+0" :preview-src-list="previewList" :preview-src-list-order="0" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[0].url+':small'" class="border border-white" fit="cover" lazy style="width: 50%; height: 50%; position: absolute; border-top-left-radius: 14px 14px"></el-image>
                <el-image :alt="list[1].uid+'_'+list[1].tweet_id+'_'+1" :preview-src-list="previewList" :preview-src-list-order="1" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[1].url+':small'" class="border border-white" fit="cover" lazy style="width: 50%; height: 50%; margin-left: 50%; position: absolute; border-top-right-radius: 14px 14px"></el-image>
                <el-image :alt="list[2].uid+'_'+list[2].tweet_id+'_'+2" :preview-src-list="previewList" :preview-src-list-order="2" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[2].url+':small'" class="border border-white" fit="cover" lazy style="width: 50%; height: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-left-radius: 14px 14px"></el-image>
                <el-image :alt="list[3].uid+'_'+list[3].tweet_id+'_'+3" :preview-src-list="previewList" :preview-src-list-order="3" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[3].url+':small'" class="border border-white" fit="cover" lazy style="width: 50%; height: 50%; margin-left: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-right-radius: 14px 14px"></el-image>
            </div>
        </div>
    </div>
</template>

<script>
//import DPlayer from 'dplayer';
//const dp = new DPlayer(options);
export default {
  name: "imageList",
  props: {
    list: Array,
    is_video: String,
    //is_video: {
    //  type: [String, Boolean, Number],
    //  default: '1'
    //},
    bottom: {
      type: Boolean,
      default: false
    },
    online: {
        type: Boolean,
        default: false,
    },
    unlimited: {
        type: Boolean,
        default: false,
    },
    preload: {
        type: String,
        default: "none",
    },
        },
        computed: {
            previewList: function () {
                return this.list.map(s => this.mediaPath+(this.mediaPath === this.basePath ? `/api/v2/media/tweets/` : '') + s.url + ':large');
            },
            ratio: function () {
              return this.list[0].origin_info_width / this.list[0].origin_info_height;
            }
        }
    }
</script>

<style scoped>

</style>
