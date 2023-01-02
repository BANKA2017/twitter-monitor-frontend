<template>
  <div id="imageList" class="mb-2" @click="e => {e.stopPropagation()}">
    <div v-if="realList.length === 1" :style="{'height': '100%', 'aspect-ratio': isVideo(realList[0]) ? (realList[0].origin_info_width > realList[0].origin_info_height ? realList[0].origin_info_width / realList[0].origin_info_height : 1) : aspect_ratio}">
      <div v-if="isVideo(realList[0])" style="height: 100%; ">
        <video :id="'video_' + realList[0].tweet_id + '_0'" controls playsinline crossorigin :poster="createRealMediaPath(realMediaPath, samePath,'tweets') + realList[0].cover" :preload="preload" :style="{'aspect-ratio': (realList[0].origin_info_width > realList[0].origin_info_height ? realList[0].origin_info_width / realList[0].origin_info_height : 1)}">
          <source :src="createRealMediaPath(realMediaPath, samePath,'tweets') +realList[0].url">
        </video>
      </div>
      <div v-else :style="`width: 100%;` + (((ratio) => ratio > 100 ? ' aspect-ratio: 1; ' : ` padding-bottom: ${ratio}%; `)(realList[0].origin_info_height / realList[0].origin_info_width * 100)) + `height: 100%; border-radius: 14px 14px 14px 14px;`" class="no-gutters card">
        <el-image :alt="realList[0].description || realList[0].uid+'_'+realList[0].tweet_id+'_'+0" :initial-index="0" :preview-src-list="previewList" :src="createRealMediaPath(realMediaPath, samePath,'tweets') +realList[0].url+(realList[0].source !== 'tweets' ? '' : ':small')" :fit="(realList[0].origin_info_height / realList[0].origin_info_width <= 1) ? 'fill' : 'scale-down'" lazy style="width: 100%; height: 100%; position: absolute; border-radius: 14px 14px 14px 14px; padding: 1px;" preview-teleported hide-on-click-modal>
          <template #placeholder>
            <blur-hash-canvas v-if="realList[0].blurhash && realList[0].blurhash !== 'deleted'" :hash-text="realList[0].blurhash" class="full"/>
          </template>
          <template #error>
            <blur-hash-canvas v-if="realList[0].blurhash && realList[0].blurhash !== 'deleted'" :hash-text="realList[0].blurhash" class="full"/>
          </template>
        </el-image>
      </div>
    </div>
    <div v-else-if="realList.length >= 2 && realList.length <= 6">
      <div class="card no-gutters" :style="{'width': '100%', 'padding-bottom': '56.25%', 'height': '100%', 'border-radius': '14px 14px 14px 14px'}">
        <template v-for="(mixMedia, order) in realList" :key="order">
          <video v-if="isVideo(mixMedia)" :style="listStyle[realList.length-2][order] + ' object-fit: cover;'" :id="'video_' + mixMedia.tweet_id + '_' + order" controls playsinline crossorigin :poster="createRealMediaPath(realMediaPath, samePath,'tweets') + mixMedia.cover" :preload="preload">
            <source :src="createRealMediaPath(realMediaPath, samePath,'tweets') +mixMedia.url">
          </video>
          <el-image v-else style="padding: 1px;" :alt="mixMedia.description || mixMedia.uid+'_'+mixMedia.tweet_id+'_'+0" :initial-index="order" :preview-src-list="previewList" :src="createRealMediaPath(realMediaPath, samePath,'tweets') +mixMedia.url+(realList[0].source !== 'tweets' ? '' : ':small')" :style="listStyle[realList.length-2][order]" fit="cover" lazy preview-teleported hide-on-click-modal>
            <template #placeholder>
              <blur-hash-canvas class="full" :hash-text="mixMedia.blurhash" v-if="mixMedia.blurhash && mixMedia.blurhash !== 'deleted'"/>
            </template>
            <template #error>
              <blur-hash-canvas class="full" :hash-text="mixMedia.blurhash" v-if="mixMedia.blurhash && mixMedia.blurhash !== 'deleted'"/>
            </template>
          </el-image>
        </template>
      </div>
    </div>
    <div v-else class="row justify-content-around">
      <!--应该没那么多视频...吧-->
      <div class="mx-1 mb-4 rounded-3" style="width: calc(100% / 3 - 15px); aspect-ratio: 1" v-for="(image, order) in realList" :key="order">
        <el-image class="rounded-3" style="height: 100%; width: 100%" :alt="image.uid+'_'+image.tweet_id+'_'+0" :initial-index="order" :preview-src-list="previewList" :src="createRealMediaPath(realMediaPath, samePath,'tweets') +image.url+(realList[0].source !== 'tweets' ? '' : ':small')" fit="cover" lazy preview-teleported hide-on-click-modal>
          <template #placeholder>
            <blur-hash-canvas class="full" :hash-text="image.blurhash" v-if="image.blurhash && image.blurhash !== 'deleted'"/>
          </template>
          <template #error>
            <blur-hash-canvas class="full" :hash-text="image.blurhash" v-if="image.blurhash && image.blurhash !== 'deleted'"/>
          </template>
        </el-image>
      </div>
    </div>
    <template v-if="realList.some(item => item.title || item.description)">
      <hr class="my-4">
      <p class="fw-bold my-1" v-if="realList[0].title && realList[0].title === 'ALT'">ALT</p>
      <full-text v-else-if="realList.some(item => item.title)" class="fw-bold my-1" :entities="[]" :full_text_origin='realList.filter(item => item.title).map(item => item.title).join("\n")' />
      <full-text v-if="realList.some(item => item.description)" class="my-1" :entities="[]" :full_text_origin='realList.filter(item => item.description).map(item => item.description).join("\n\n")' />
    </template>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, PropType, ref} from "vue";
import {Media, MediaSize, OnlineMedia} from "@/type/Content";
import {useStore} from "@/store";
import {createRealMediaPath} from "@/share/Tools";
import BlurHashCanvas from "@/components/BlurHashCanvas.vue";

import Plyr from 'plyr'
import FullText from "@/components/FullText.vue";
import {type} from "os";

const props = defineProps({
  mediaStatus: {
    type: Boolean,
    default: false
  },
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
      "width: 50%; height: 100%; position: absolute; border-radius: 14px 0 0 14px;",
      "width: 50%; height: 100%; margin-left: 50%; position: absolute; border-radius: 0 14px 14px 0;"
    ], [
      "width: 50%; height: 100%; position: absolute; border-radius: 14px 0 0 14px;",
      "width: 50%; height: 50%; margin-left: 50%; position: absolute; border-top-right-radius: 14px 14px;",
      "width: 50%; height: 50%; margin-left: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-right-radius: 14px 14px;"
    ], [
      "width: 50%; height: 50%; position: absolute; border-top-left-radius: 14px 14px;",
      "width: 50%; height: 50%; margin-left: 50%; position: absolute; border-top-right-radius: 14px 14px;",
      "width: 50%; height: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-left-radius: 14px 14px;",
      "width: 50%; height: 50%; margin-left: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-right-radius: 14px 14px;"
    ],[
      "width: calc(100% / 3); height: 50%; position: absolute; border-top-left-radius: 14px 14px;",
      "width: calc(100% / 3); height: 50%; margin-left: calc(100% / 3); position: absolute;",
      "width: calc(100% / 3); height: 50%; margin-left: calc(100% / 3 * 2); position: absolute; border-top-right-radius: 14px 14px;",
      "width: 50%; height: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-left-radius: 14px 14px;",
      "width: 50%; height: 50%; margin-left: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-right-radius: 14px 14px;"
    ],[
      "width: calc(100% / 3); height: 50%; position: absolute; border-top-left-radius: 14px 14px;",
      "width: calc(100% / 3); height: 50%; margin-left: calc(100% / 3); position: absolute;",
      "width: calc(100% / 3); height: 50%; margin-left: calc(100% / 3 * 2); position: absolute; border-top-right-radius: 14px 14px;",
      "width: calc(100% / 3); height: 50%; margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-left-radius: 14px 14px;",
      "width: calc(100% / 3); height: 50%; margin-left: calc(100% / 3); margin-top: calc( 9 / 16 * 50% ); position: absolute;",
      "width: calc(100% / 3); height: 50%; margin-left: calc(100% / 3 * 2); margin-top: calc( 9 / 16 * 50% ); position: absolute; border-bottom-right-radius: 14px 14px;"
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

const isVideo = (media: Media | OnlineMedia) => media.content_type === 'video/mp4'

onMounted(() => {
  const VideoHook: {video: HTMLElement; handle: IntersectionObserver}[] = []
  for (const mixMediaIndex in realList.value) {
    if (!isVideo(realList.value[mixMediaIndex])) {continue}
    if (realList.value.length === 1) {
      new Plyr('#video_' + realList.value[mixMediaIndex].tweet_id + '_' + mixMediaIndex,{
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
    const video = document.getElementById('video_' + realList.value[mixMediaIndex].tweet_id + '_' + mixMediaIndex)
    if (video instanceof HTMLVideoElement) {
      const observer = new IntersectionObserver((entries, observer) => {
        if (video.buffered) {
          if (entries[0].intersectionRatio > 0) {
            //plyrHandle.play()
          } else {
            //auto pause
            video.pause()
          }
        }
      }, {
        root: document,
        rootMargin: '0px',
        threshold: [0, 1]
      })
      VideoHook.push({video, handle: observer})
    }
  }

  VideoHook.forEach(hook => {
    hook.handle.observe(hook.video)
  })
})
</script>

<style scoped>

</style>
