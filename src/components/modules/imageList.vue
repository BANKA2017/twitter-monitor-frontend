<template>
    <div id="imageList">
        <div v-if="is_video === 1">
            <div :class="`no-gutters embed-responsive embed-responsive-` + (ratio < 16 / 9 ? (ratio < 4 / 3 ? '1by1' : '4by3') :ratio > 16 / 9 ? '21by9' : '16by9')">
                <video id="videoPlayer"
                       :preload="preload"
                       :poster="createRealMediaPath('tweets') + realList[0].cover" :src="createRealMediaPath('tweets') +realList[0].url" :type="realList[0].content_type" class="border" controls
                       playsinline
                       style="width: 100%; height: 100%; border-radius: 14px 14px 14px 14px; background-color: black"></video>
            </div>
        </div>
        <div v-else-if="realList.length === 1">
            <div :style="`width: 100%; padding-bottom: ` + ( realList[0].origin_info_height / realList[0].origin_info_width * 100) +  `%; height: 0; border-radius: 14px 14px 14px 14px`" class="no-gutters card">
                <el-image :alt="realList[0].uid+'_'+realList[0].tweet_id+'_'+0" :initial-index="0" :preview-src-list="previewList" :src="createRealMediaPath('tweets') +realList[0].url+':small'" class="border border-white" fit="cover" lazy style="width: 100%; height: 100%; position: absolute; border-radius: 14px 14px 14px 14px">
                  <template #placeholder>
                    <!--TODO fix blurhash-->
                      <!--<blur-hash-canvas v-if="realList[0].blurhash && realList[0].blurhash !== 'deleted'" :hash-text="realList[0].blurhash" class="full" :width="realList[0].origin_info_width" :height="realList[0].origin_info_height"/>-->
                  </template>
                </el-image>
            </div>
        </div>
        <div v-else-if="realList.length >= 2 && realList.length <= 4">
            <div class="card no-gutters" style="width: 100%; padding-bottom: 56.25%; height: 0; border-radius: 14px 14px 14px 14px">
                <el-image v-for="(image, order) in realList" :key="order" :alt="image.uid+'_'+image.tweet_id+'_'+0" :initial-index="order" :preview-src-list="previewList" :src="createRealMediaPath('tweets') +image.url+':small'" :style="listStyle[realList.length-2][order]" class="border border-white" fit="cover" lazy>
                  <template #placeholder>
                    <!--<blur-hash-canvas class="full" :hash="image.blurhash" v-if="image.blurhash && image.blurhash !== 'deleted'" :hash-text="image.blurhash" :width="image.origin_info_width" :height="image.origin_info_height"/>-->
                  </template>
                </el-image>
            </div>
        </div>
    </div>
</template>

<script>
//import Vue from 'vue'
//import VueBlurHash from 'vue-blurhash'

// Import css if you want to use image fade transition
//import 'vue-blurhash/dist/vue-blurhash.css'
//Vue.use(VueBlurHash)
//import DPlayer from 'dplayer';
//const dp = new DPlayer(options);
import {mapState} from "vuex";
//import BlurHashCanvas from "@/components/modules/blurHashCanvas";

export default {
  name: "imageList",
  //components: {BlurHashCanvas},
  props: {
    list: Array,
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
      default: "orig",
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
        computed: mapState({
            settings: 'settings',
            realMediaPath: 'realMediaPath',
            samePath: 'samePath',
            previewList: function () {
                return this.realList.map(s => this.settings.data.mediaPath+(this.settings.data.mediaPath === this.settings.data.basePath ? `/api/v2/media/tweets/` : '') + s.url + ':' + this.size);
            },
            ratio: function () {
              return this.realList[0].origin_info_width / this.realList[0].origin_info_height;
            },
            realList: function () {
              let tmpNameList = []
              let tmpList = []
              this.list.map(x => {
                if (tmpNameList.indexOf(x.filename) === -1) {
                  tmpNameList.push(x.filename)
                  tmpList.push(x)
                }
              })
              return tmpList
            }
        }),
        methods: {
            createRealMediaPath: function (type = 'tweets') {
              return this.realMediaPath + (this.samePath ? type + '/' : '')
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
