<template>
  <div id="imageList">
    <div v-if="is_video === 1">
      <div :class="`no-gutters embed-responsive embed-responsive-` + (ratio < 16 / 9 ? (ratio < 4 / 3 ? '1by1' : '4by3') :ratio > 16 / 9 ? '21by9' : '16by9')">
        <video id="videoPlayer"
               :preload="preload"
               :poster="createRealMediaPath(realMediaPath, samePath.value,'tweets') + realList[0].cover" :src="createRealMediaPath(realMediaPath, samePath.value,'tweets') +realList[0].url" :type="realList[0].content_type" class="border" controls
               playsinline
               style="width: 100%; height: 100%; border-radius: 14px 14px 14px 14px; background-color: black"></video>
      </div>
    </div>
    <div v-else-if="realList.length === 1">
      <div :style="`width: 100%; padding-bottom: ` + ( realList[0].origin_info_height / realList[0].origin_info_width * 100) +  `%; height: 0; border-radius: 14px 14px 14px 14px`" class="no-gutters card">
        <el-image :alt="realList[0].uid+'_'+realList[0].tweet_id+'_'+0" :initial-index="0" :preview-src-list="previewList" :src="createRealMediaPath(realMediaPath, samePath.value,'tweets') +realList[0].url+':small'" class="border border-white" fit="cover" lazy style="width: 100%; height: 100%; position: absolute; border-radius: 14px 14px 14px 14px">
          <template #placeholder>
            <!--TODO fix blurhash-->
            <!--<blur-hash-canvas v-if="realList[0].blurhash && realList[0].blurhash !== 'deleted'" :hash-text="realList[0].blurhash" class="full" :width="realList[0].origin_info_width" :height="realList[0].origin_info_height"/>-->
          </template>
        </el-image>
      </div>
    </div>
    <div v-else-if="realList.length >= 2 && realList.length <= 4">
      <div class="card no-gutters" style="width: 100%; padding-bottom: 56.25%; height: 0; border-radius: 14px 14px 14px 14px">
        <el-image v-for="(image, order) in realList" :key="order" :alt="image.uid+'_'+image.tweet_id+'_'+0" :initial-index="order" :preview-src-list="previewList" :src="createRealMediaPath(realMediaPath, samePath.value,'tweets') +image.url+':small'" :style="listStyle[realList.length-2][order]" class="border border-white" fit="cover" lazy>
          <template #placeholder>
            <!--<blur-hash-canvas class="full" :hash="image.blurhash" v-if="image.blurhash && image.blurhash !== 'deleted'" :hash-text="image.blurhash" :width="image.origin_info_width" :height="image.origin_info_height"/>-->
          </template>
        </el-image>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, PropType} from "vue";
import {Media, MediaSize} from "@/type/Content";
import {useStore} from "@/store";
import {createRealMediaPath} from "@/share/Tools";

const props = defineProps({
  list: {
    type: Array as PropType<Media[]>,
    default: () => []
  },
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
    type: String as PropType<MediaSize>,
    default: "orig",
  },
})

const listStyle =  [
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
]

const store = useStore()
const settings = computed(() => store.state.settings)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)

const realList = computed(() => {
  let tmpNameList: string[] = []
  let tmpList: Media[] = []
  props.list.map(x => {
    if (!tmpNameList.includes(x.filename)) {
      tmpNameList.push(x.filename)
      tmpList.push(x)
    }
  })
  return tmpList
})

const ratio = computed(() => {
  if (realList.value.length > 0) {
    return realList.value[0].origin_info_width / realList.value[0].origin_info_height
  }
  return 0
})

const previewList = computed(() => realList.value.map(s => createRealMediaPath(realMediaPath.value, samePath.value,"tweets") + s.url + ':' + props.size))
//import Vue from 'vue'
//import VueBlurHash from 'vue-blurhash'

// Import css if you want to use image fade transition
//import 'vue-blurhash/dist/vue-blurhash.css'
//Vue.use(VueBlurHash)
//import DPlayer from 'dplayer';
//const dp = new DPlayer(options);
//import BlurHashCanvas from "@/components/modules/blurHashCanvas";
</script>

<style scoped>
  .full {
    height: 100%;
    width: 100%
  }
</style>
