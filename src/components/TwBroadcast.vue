<template>
  <div class="border-bottom">
    <div :style="{width: '100%', height: '100%', 'border-radius': '14px 14px 0 0'}" class="no-gutters">
      <div v-if="!state.loaded" class="text-center my-2"><span class="spinner-border text-primary" role="status" aria-hidden="true"></span></div>
      <video v-show="state.loaded" controls :id="'broadcast_player_' + tweet_id" :poster="createRealMediaPath(realMediaPath, samePath)+cover"></video>
    </div>
  </div>
  <div class="card-body position-static">
    <small class="mb-1 gap-1">
      <span :style="{padding: '1px 5px', color: 'white', 'border-radius': '0.375rem 0 0 0.375rem', 'background-color': state.state === 'running' ? '#F91880' : 'gray'}">{{ {running: 'LIVE', padding: 'PADDING', 'ended': 'REPLAY'}[state.state] }}</span>
      <span :style="{padding: '1px 5px', color: 'white', 'border-radius': '0 0.375rem 0.375rem 0', 'background-color': 'black'}">{{ state.total }}</span>
    </small>
    <p class="card-title" style="color: black">{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
import Plyr from 'plyr'
import Hls from "hls.js/dist/hls.light.min.js";
import {useStore} from "@/store";
import {computed, onBeforeUnmount, onMounted, reactive} from "vue";
import {createRealMediaPath, Notice} from "@/share/Tools";
import {request} from "@/share/Fetch";
import {ApiBroadcast} from "@/type/Api";
const props = defineProps({
  tweet_id: {
    type: String,
    default: '0'
  },
  cover: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

const store = useStore()
const settings = computed(() => store.state.settings)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)
const onlinePath = computed(() => store.state.onlinePath)

const state = reactive<{
  loaded: boolean
  state: string
  total: number
}>({
  loaded: false,
  state: 'padding',
  total: 0
})

const hls = new Hls()
onMounted(() => {
  //get id
  const id = props.url?.replaceAll('https://twitter.com/i/broadcasts/', '')
  request<ApiBroadcast>(onlinePath.value + '/api/v3/data/broadcast/?id=' + id).then(response => {
    state.total = response.data.total
    state.state = response.data.state
    if (!Hls.isSupported()) {
      Notice('Not supported HLS', 'error', 0)
    } else if (!response.data.playback) {
      Notice('No playback link')
    } else if (response.data.playback) {
      let defaultOptions = {
        autoplay: false,
        volume: 0.7,
        iconUrl: '/static/img/plyr.svg',
        blankVideo: '/static/video/blank.mp4',
        settings: ['quality', 'speed', 'loop'],
        quality: {},
        controls: [
          'play-large', // The large play button in the center
          'play', // Play/pause playback
          'progress', // The progress bar and scrubber for playback and buffering
          'current-time', // The current time of playback
          'duration', // The full duration of the media
          'mute', // Toggle mute
          'volume', // Volume control
          'fullscreen', // Toggle fullscreen
          'settings'
        ]
      }
      // For more Hls.js options, see https://github.com/dailymotion/hls.js
      hls.loadSource(createRealMediaPath(realMediaPath.value, samePath.value,'tweets') + response.data.playback?.replace(/^https:\/\//, ''))
      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {

        // Transform available levels into an array of integers (height values).
        const availableQualities = hls.levels.map((l) => l.height)

        //https://github.com/sampotts/plyr/issues/1919
        // Add new qualities to option
        defaultOptions.quality = {
          default: availableQualities[availableQualities.length > 0 ? availableQualities.length - 1 : 0],
          options: availableQualities,
          // this ensures Plyr to use Hls to update quality level
          // Ref: https://github.com/sampotts/plyr/blob/master/src/js/html5.js#L77
          forced: true,
          onChange: (e) => updateQuality(e),
        }

        // Initialize new Plyr player with quality options
        new Plyr('#broadcast_player_' + props.tweet_id, defaultOptions)
        state.loaded = true
      });
      const broadcast = document.getElementById('broadcast_player_' + props.tweet_id)
      if (broadcast instanceof HTMLVideoElement) {
        const observer = new IntersectionObserver((entries, observer) => {
          if (broadcast.buffered) {
            if (entries[0].intersectionRatio > 0) {
              //plyrHandle.play()
            } else {
              //auto pause
              broadcast.pause()
            }
          }
        }, {
          root: document,
          rootMargin: '0px',
          threshold: [0, 1]
        })
        observer.observe(broadcast)
      }
      hls.attachMedia(broadcast)
    }
  }).catch(e => {
    Notice(String(e), "error")
  })
})

onBeforeUnmount(() => {
  hls.destroy()
})

const updateQuality = (newQuality) => {
  hls.levels.forEach((level, levelIndex) => {
    if (level.height === newQuality) {
      console.log("Found quality match with " + newQuality);
      hls.currentLevel = levelIndex;
    }
  });
}


</script>

<style scoped>

</style>