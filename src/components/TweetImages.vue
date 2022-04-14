<template>
  <div id="imageList">
    <div v-if="is_video" style="height: 100%">
      <video :id="'video' + realList[0].tweet_id" controls playsinline crossorigin :poster="createRealMediaPath(realMediaPath, samePath.value,'tweets') + realList[0].cover" :preload="preload" style="width: 100%; height: 100%;">
        <source :src="createRealMediaPath(realMediaPath, samePath.value,'tweets') +realList[0].url">
      </video>
    </div>
    <div v-else-if="realList.length === 1" :style="{'height': '100%', 'aspect-ratio': aspect_ratio}">
      <div :style="`width: 100%; padding-bottom: ` + ( realList[0].origin_info_height / realList[0].origin_info_width * 100) +  `%; height: 100%; border-radius: 14px 14px 14px 14px`" class="no-gutters card">
        <el-image :alt="realList[0].uid+'_'+realList[0].tweet_id+'_'+0" :initial-index="0" :preview-src-list="previewList" :src="createRealMediaPath(realMediaPath, samePath.value,'tweets') +realList[0].url+(realList[0].source !== 'tweets' ? '' : ':small')" class="border border-white" fit="cover" lazy style="width: 100%; height: 100%; position: absolute; border-radius: 14px 14px 14px 14px" preview-teleported hide-on-click-modal>
          <template #placeholder>
            <blur-hash-canvas v-if="realList[0].blurhash && realList[0].blurhash !== 'deleted'" :hash-text="realList[0].blurhash" class="full"/>
          </template>
          <template #error>
            <blur-hash-canvas v-if="realList[0].blurhash && realList[0].blurhash !== 'deleted'" :hash-text="realList[0].blurhash" class="full"/>
          </template>
        </el-image>
      </div>
    </div>
    <div v-else-if="realList.length >= 2 && realList.length <= 4">
      <div class="card no-gutters" :style="{'width': '100%', 'padding-bottom': '56.25%', 'height': '100%', 'border-radius': '14px 14px 14px 14px'}">
        <el-image v-for="(image, order) in realList" :key="order" :alt="image.uid+'_'+image.tweet_id+'_'+0" :initial-index="order" :preview-src-list="previewList" :src="createRealMediaPath(realMediaPath, samePath.value,'tweets') +image.url+(realList[0].source !== 'tweets' ? '' : ':small')" :style="listStyle[realList.length-2][order]" class="border border-white" fit="cover" lazy preview-teleported hide-on-click-modal>
          <template #placeholder>
            <blur-hash-canvas class="full" :hash-text="image.blurhash" v-if="image.blurhash && image.blurhash !== 'deleted'"/>
          </template>
          <template #error>
            <blur-hash-canvas class="full" :hash-text="image.blurhash" v-if="image.blurhash && image.blurhash !== 'deleted'"/>
          </template>
        </el-image>
      </div>
    </div>
    <div v-else class="row justify-content-around">
      <div class="mx-1 mb-4 rounded-3" style="width: calc(100% / 3 - 15px); aspect-ratio: 1" v-for="(image, order) in realList" :key="order">
        <el-image class="rounded-3" style="height: 100%; width: 100%" :alt="image.uid+'_'+image.tweet_id+'_'+0" :initial-index="order" :preview-src-list="previewList" :src="createRealMediaPath(realMediaPath, samePath.value,'tweets') +image.url+(realList[0].source !== 'tweets' ? '' : ':small')" fit="cover" lazy preview-teleported hide-on-click-modal>
          <template #placeholder>
            <blur-hash-canvas class="full" :hash-text="image.blurhash" v-if="image.blurhash && image.blurhash !== 'deleted'"/>
          </template>
          <template #error>
            <blur-hash-canvas class="full" :hash-text="image.blurhash" v-if="image.blurhash && image.blurhash !== 'deleted'"/>
          </template>
        </el-image>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, PropType, ref} from "vue";
import {Media, MediaSize, OnlineMedia} from "@/type/Content";
import {useStore} from "@/store";
import {createRealMediaPath} from "@/share/Tools";
import BlurHashCanvas from "@/components/BlurHashCanvas.vue";

import Plyr from 'plyr'

const props = defineProps({
  list: {
    type: Array as PropType<Media[] | OnlineMedia[]>,
    default: () => []
  },
  is_video: {
    type: [String, Boolean, Number],
    default: 1
  },
  aspect_ratio: {
    type: String,
    default: 'auto'
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
  let tmpList: (Media | OnlineMedia)[] = []
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

const previewList = computed(() => realList.value.map(s => createRealMediaPath(realMediaPath.value, samePath.value,"tweets") + s.url + (s.source !== 'tweets' ? '' : (':' + props.size))))

onMounted(() => {
  if (props.is_video) {
    new Plyr('#video' + realList.value[0].tweet_id,{
      autoplay: false,
      volume: 0.7,
      iconUrl: '/static/img/plyr.svg',
      blankVideo: '/static/video/blank.mp4',
      controls: [
        'play-large', // The large play button in the center
        'play', // Play/pause playback
        'progress', // The progress bar and scrubber for playback and buffering
        'current-time', // The current time of playback
        'duration', // The full duration of the media
        'mute', // Toggle mute
        'volume', // Volume control
        'captions', // Toggle captions
        'download',
        'fullscreen', // Toggle fullscreen
      ]
    })
  }
})
</script>

<style scoped>
  .full {
    height: 100%;
    width: 100%
  }
</style>
