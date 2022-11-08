<template>
  <div class="container" style="width: 100vw; position: fixed; bottom: 10px ;" v-show="spacesPlayer.display">
    <div class="row" :style="{width: width >= 768 ? '100vw' : (width >= 540 ? '90vw' : '80vw')}">
      <div class="shadow-lg border-3 border-top border-warning p-2 rounded-3 bg-white col-10 offset-1 col-md-6 offset-md-3">
        <div class="d-flex justify-content-between">
          <p class="text-truncate px-2 my-0" ><span class="fw-bold">{{spacesPlayer.displayName}}</span> · <span class="small">{{spacesPlayer.title}}</span></p>
          <btn class="btn btn-sm btn-outline-danger border-0 rounded-pill px-2 py-0" @click="close"><x-lg status="" width="1em" height="1em" /></btn>
        </div>
        <audio controls autoplay id="spaces-player" ></audio>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Plyr from 'plyr'
import Hls from "hls.js/dist/hls.light.min.js";
import {computed, onMounted, watch} from "vue";
import {useStore} from "@/store";
import {createRealMediaPath, Notice} from "@/share/Tools";
import XLg from "@/icons/XLg.vue";

//const props = defineProps({
//  playback: {
//    type: String,
//    default: ''
//  },
//  id: {
//    type: String,
//    default: ''
//  }
//})

const store = useStore()
const width = computed(() => store.state.width)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)
const spacesPlayer = computed(() => store.state.spacesPlayer)

const hls = new Hls()
let audiospace: HTMLAudioElement = new Audio()
let player

const hlsPlayer = () => {
  if (!Hls.isSupported()) {
    Notice('Not supported HLS', 'error')
  } else if (spacesPlayer.value.link) {
    // For more Hls.js options, see https://github.com/dailymotion/hls.js
    hls.loadSource(createRealMediaPath(realMediaPath.value, samePath.value,'tweets') + spacesPlayer.value.link?.replace(/^https:\/\//, ''))
    hls.attachMedia(audiospace)
  }
}

const close = () => {
  player.pause()
  store.dispatch('updateSpacesPlayerItem', {key: 'id', value: ''})
  store.dispatch('updateSpacesPlayerItem', {key: 'link', value: ''})
  store.dispatch('updateSpacesPlayerItem', {key: 'display', value: false})
}

onMounted(() => {
  audiospace = document.getElementById('spaces-player')
  player = new Plyr('#spaces-player', {})
  //hlsPlayer()
})

watch(spacesPlayer, () => {
  hlsPlayer()
}, {deep: true})
</script>

<style scoped>

</style>