<template>
  <div class="container container-fluid mb-2">
    <div class="row">
      <router-link :to="`/i/status/${mediaItem.tweet_id}`" class="col-6 col-lg-4 p-0 d-block position-relative" v-for="(mediaItem, index) in mediaList" :key="index">
        <div style="top: 0.5em; right: 0.5em;" class="position-absolute" v-if="mediaItem.origin_type !== 'photo'"><camera-video-icon height="2em" status="text-white" width="2em"/></div>
        <img style="object-fit: cover; aspect-ratio: 1; width: 100%; background: #f5f7fa;" loading="lazy" :src="createRealMediaPath(realMediaPath, samePath, 'tweets')+mediaItem.cover" alt="tweet image">
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed, PropType} from "vue";
import {Tweet} from "@/type/Content";
import {createRealMediaPath} from "@/share/Tools";
import {useStore} from "@/store";
import CameraVideoIcon from "@/icons/CameraVideoIcon.vue";

const props = defineProps({
  tweets: {
    type: Array as PropType<Tweet[]>,
    default: []
  }
})
const store = useStore()
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)
const mediaList = computed(() => [...new Set(props.tweets.map(tweet => tweet.mediaObject).flat().filter(media => media.source === 'tweets'))])

</script>

<style scoped lang="scss">

</style>