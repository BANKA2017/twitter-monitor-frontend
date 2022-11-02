<template>
  <div id="tweet-album">
    <div class="container container-fluid mb-2">
      <div class="row">
        <router-link :to="`/i/status/${mediaItem.tweet_id}`" class="col-6 col-lg-4 px-1 d-block position-relative" v-for="(mediaItem, index) in mediaList" :key="index">
          <div style="top: 0.5em; right: 0.5em; " class="position-absolute" v-if="mediaItem.origin_type !== 'photo'"><camera-video-icon height="2em" status="text-white" width="2em"/></div>
          <el-image fit="cover" class="ratio ratio-1x1" style="width: 100%;" lazy :src="createRealMediaPath(realMediaPath, samePath, 'tweets')+mediaItem.cover" alt="tweet image" :id="`tweet-album-${index}`" >
            <template #placeholder>
              <blur-hash-canvas v-if="mediaItem.blurhash && mediaItem.blurhash !== 'deleted'" :hash-text="mediaItem.blurhash" class="full"/>
            </template>
            <template #error>
              <blur-hash-canvas v-if="mediaItem.blurhash && mediaItem.blurhash !== 'deleted'" :hash-text="mediaItem.blurhash" class="full"/>
            </template>
          </el-image>
          <!--@contextmenu="rightClick"-->
        </router-link>
      </div>
    </div>
    <!--<div class="position-absolute list-group" :style="{top: state.position.y + 'px', left: (state.position.x + 200 > width ? state.position.x - 200 : state.position.x) + 'px'}" v-if="mediaList.length && state.position.index > -1" v-show="state.position.x >= 0 && state.position.y >= 0">
      <div class="list-group-item list-group-item-action p-0" >
        <img style="object-fit: cover; width: 100%; max-width: 200px; background: #f5f7fa; border-radius: 0.375rem 0.375rem 0 0;" :src="createRealMediaPath(realMediaPath, samePath, 'tweets')+mediaList[state.position.index].cover" alt="tweet image" >
      </div>
      <a :href="createRealMediaPath(realMediaPath, samePath, 'tweets')+mediaList[state.position.index].cover" class="list-group-item list-group-item-action" target="_blank">下載封面</a>
      <a :href="createRealMediaPath(realMediaPath, samePath, 'tweets')+mediaList[state.position.index].url + (mediaList[state.position.index].origin_type !== 'photo' ? '' : ':orig')" class="list-group-item list-group-item-action" target="_blank">下載{{mediaList[state.position.index].origin_type !== 'photo' ? '視頻' : '原圖'}}</a>
      <a :href="`https://twitter.com/i/status/${mediaList[state.position.index].tweet_id}`" class="list-group-item list-group-item-action" target="_blank">訪問推文</a>
    </div>-->
  </div>
</template>

<script setup lang="ts">

import {computed, onMounted, PropType, reactive} from "vue";
import {Tweet} from "@/type/Content";
import {createRealMediaPath} from "@/share/Tools";
import {useStore} from "@/store";
import CameraVideoIcon from "@/icons/CameraVideoIcon.vue";
import BlurHashCanvas from "@/components/BlurHashCanvas.vue";

const props = defineProps({
  tweets: {
    type: Array as PropType<Tweet[]>,
    default: []
  }
})
const store = useStore()
//const viewportHeight = computed(() => store.state.viewportHeight)
//const width = computed(() => store.state.width)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)
const mediaList = computed(() => [...new Set(props.tweets.map(tweet => tweet.mediaObject).flat().filter(media => media.source === 'tweets'))])

//const state = reactive<{
//  position: {x: number; y: number, index: number}
//}>({
//  position: {x: -1, y: -1, index: -1}
//})
//
//onMounted(() => {
//  document.addEventListener('click', () => {
//    if (state.position.index > -1) {
//      state.position = {x: -1, y: -1, index: -1}
//    }
//  })
//  document.addEventListener('resize', () => {
//    if (state.position.index > -1) {
//      state.position = {x: -1, y: -1, index: -1}
//    }
//  })
//})
//
//const rightClick = (e: MouseEvent) => {
//  e.preventDefault()
//  if (e.target) {
//    state.position.x = e.pageX
//    state.position.y = e.pageY
//    state.position.index = Number((e.target?.id || '-1').replace('tweet-album-', ''))
//  }
//  //console.log(state)
//  //console.log(e)
//}

</script>

<style scoped lang="scss">

</style>