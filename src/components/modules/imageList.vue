<template>
    <div id="imageList">
        <div v-if="is_video === 1">
            <div :class="`no-gutters embed-responsive embed-responsive-` + (ratio < 16 / 9 ? (ratio < 4 / 3 ? '1by1' : '4by3') :ratio > 16 / 9 ? '21by9' : '16by9')">
                <video :poster="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[0].cover"
                       :preload="preload"
                       id="videoPlayer" :type="list[0].content_type" class="border" controls playsinline
                       :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[0].url"
                       style="width: 100%; height: 100%; border-radius: 14px 14px 14px 14px; background-color: black"></video>
            </div>
        </div>
        <div v-else-if="list.length === 1">
            <div :style="`width: 100%; padding-bottom: ` + ((unlimited || ratio > 16 / 9) ? list[0].origin_info_height / list[0].origin_info_width * 100 : 56.25) +  `%; height: 0; border-radius: 14px 14px 14px 14px`" class="no-gutters card">
                <el-image :alt="list[0].uid+'_'+list[0].tweet_id+'_'+0" :preview-src-list="previewList" :preview-src-list-order="0" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +list[0].url+':small'" class="border border-white" fit="cover" lazy style="width: 100%; height: 100%; position: absolute; border-radius: 14px 14px 14px 14px">
                  <blur-hash-canvas slot="placeholder" class="full" :hash="list[0].blurhash" v-if="list[0].blurhash && list[0].blurhash !== 'deleted'"/>
                </el-image>
            </div>
        </div>
        <div v-else-if="list.length >= 2 && list.length <= 4">
            <div class="card no-gutters" style="width: 100%; padding-bottom: 56.25%; height: 0; border-radius: 14px 14px 14px 14px">
                <el-image :alt="image.uid+'_'+image.tweet_id+'_'+0" :preview-src-list="previewList" :preview-src-list-order="0" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +image.url+':small'" class="border border-white" fit="cover" lazy :style="listStyle[list.length-2][order]" v-for="(image, order) in list" :key="order">
                  <blur-hash-canvas slot="placeholder" class="full" :hash="image.blurhash" v-if="image.blurhash && image.blurhash !== 'deleted'"/>
                </el-image>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import VueBlurHash from 'vue-blurhash'

// Import css if you want to use image fade transition
import 'vue-blurhash/dist/vue-blurhash.css'
Vue.use(VueBlurHash)
//import DPlayer from 'dplayer';
//const dp = new DPlayer(options);
export default {
  name: "imageList",
  props: {
    list: Array,
    //is_video: String,
    is_video: {
      type: [String, Boolean, Number],
      default: 1
    },
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
    size: {
      type: String,
      default: "large",
    },
        },
  data: () => ({
    listStyle: [
        [
          "width: 50%; height: 100%; position: absolute; border-radius: 14px 0 0 14px",
          "width: 50%; height: 100%; margin-left: 50%; position: absolute; border-radius: 0 14px 14px 0"
        ], [
          "width: 50%; height: 100%; position: absolute; border-radius: 14px 0 0 14px",
          "width: 50%; height: 50%; margin-left: 50%; position: absolute; border-top-right-radius: 14px 14px",
          "width: 50%; height: 50%; margin-left: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-right-radius: 14px 14px"
        ], [
          "width: 50%; height: 50%; position: absolute; border-top-left-radius: 14px 14px",
          "width: 50%; height: 50%; margin-left: 50%; position: absolute; border-top-right-radius: 14px 14px",
          "width: 50%; height: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-left-radius: 14px 14px",
          "width: 50%; height: 50%; margin-left: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-right-radius: 14px 14px"
      ],
    ],
  }),
        computed: {
            previewList: function () {
                return this.list.map(s => this.mediaPath+(this.mediaPath === this.basePath ? `/api/v2/media/tweets/` : '') + s.url + ':' + this.size);
            },
            ratio: function () {
              return this.list[0].origin_info_width / this.list[0].origin_info_height;
            }
        }
    }
</script>

<style scoped>
  .full {
    height: 100%;
    width: 100%
  }
</style>
