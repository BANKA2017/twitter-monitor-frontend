<template>
  <div class="border-bottom">
    <div style="width: 100%; border-radius: 14px 14px 0 0;" class="no-gutters container-fluid p-0">
      <div v-if="!state.loaded && cover" class="position-relative" style="min-height: 5em" @click="PlayBroadCast">
        <div class="h-100 w-100 position-absolute row align-items-center m-0" style="cursor: pointer; z-index: 2;">
          <play v-if="!state.clicked" height="3.5em" width="3.5em" status="text-primary" />
          <div v-else class="text-center"><span class="spinner-border text-primary" role="status" aria-hidden="true"></span></div>
        </div>
        <el-image :src="createRealMediaPath(realMediaPath, samePath)+cover" style="width: 100%; height: 100%; border-radius: 14px 14px 0 0; z-index: 1;" class="card-img-top" fit="cover" alt="cardImage" @click="PlayBroadCast">
          <template #placeholder>
            <div class="text-center my-2"><span class="spinner-border-sm text-primary" role="status" aria-hidden="true"></span></div>
          </template>
          <template #error>
            <div class="text-center my-2"><span class="spinner-border-sm text-primary" role="status" aria-hidden="true"></span></div>
          </template>
        </el-image>
      </div>
      <div v-else-if="!state.loaded && !cover" class="ratio ratio-16x9 container-fluid" @click="PlayBroadCast">
        <div class="h-100 row align-items-center m-0" style="cursor: pointer;">
          <play height="3.5em" width="3.5em" status="text-primary" />
        </div>
      </div>
      <video v-show="state.loaded" controls :id="'broadcast_player_' + tweet_id" :poster="createRealMediaPath(realMediaPath, samePath)+cover"></video>
    </div>
  </div>
  <div class="card-body position-static">
    <small class="mb-1" style="font-size: 0.9em;">
      <span :style="{margin: '0.25px', padding: '1px 9px', color: 'white', 'border-radius': '0.375rem 0 0 0.375rem', 'background-color': {running: '#F91880', pending: 'gray', ended: 'gray', timed_out: 'gray', not_started: '#026549'}[state.broadcastData.state] }">{{ {running: 'LIVE', pending: 'PENDING', ended: 'REPLAY', timed_out: 'ERROR', not_started: eta}[state.broadcastData.state] }}</span>
      <span :style="{margin: '0.25px', padding: '1px 5px', color: 'white', 'border-radius': '0 0.375rem 0.375rem 0', 'background-color': 'black'}">{{ state.broadcastData.total }}</span>
      <locked v-if="!state.broadcastData.playback && etaSeconds < 0 && ['running', 'ended'].includes(state.broadcastData.state)" height="1.5em" width="1.5em" status="text-danger" />
    </small>
    <p class="card-title" style="color: black">{{ title || state.broadcastData.title || 'Empty' }}</p>
  </div>
</template>

<script setup lang="ts">
import Plyr from 'plyr'
import Hls from "hls.js/dist/hls.light.min.js";
import {useStore} from "@/store";
import {computed, onBeforeUnmount, onMounted, reactive, watch} from "vue";
import {createRealMediaPath, Notice} from "@/share/Tools";
import {Controller, controller, request} from "@/share/Fetch";
import {ApiBroadcast} from "@/type/Api";
import {LiveVideoContent} from "@/type/Content";
import Play from "@/icons/Play.vue";
import Locked from "@/icons/Locked.vue";
import {secondsToText} from "@/share/Time";
import {useI18n} from "vue-i18n";
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

const {t} = useI18n()

const store = useStore()
const now = computed(() => store.state.now)
const settings = computed(() => store.state.settings)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)
const onlinePath = computed(() => store.state.onlinePath)

const state = reactive<{
  loaded: boolean
  clicked: boolean
  latestPing: number
  broadcastData: LiveVideoContent
}>({
  loaded: false,
  clicked: false,
  latestPing: Number(new Date()),
  broadcastData: {
    id: '',
    avatar: '',
    name: '',
    display_name: '',
    state: 'pending',
    start: '0',
    end: '0',
    media_key: '',
    playback: 'NOT EMPTY',
    title: '',
    total: 0,
    is_available_for_replay: false
  }
})

const hls = new Hls({
  maxBufferLength: 10,
  maxBufferSize: 5*1000*1000
})

const PlayBroadCast = () => {
  if (!state.broadcastData.playback) {
    return
  }
  state.clicked = true
  let defaultOptions = {
    autoplay: true,
    volume: 0.7,
    iconUrl: '/static/img/plyr.svg',
    blankVideo: '/static/video/blank.mp4',
    settings: ['quality', 'speed', 'loop'],
    quality: {},
    ratio: '16:9',
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
  hls.loadSource(createRealMediaPath(realMediaPath.value, samePath.value,'tweets') + state.broadcastData.playback?.replace(/^https:\/\//, ''))
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
    const plyr = new Plyr('#broadcast_player_' + props.tweet_id, defaultOptions)
    state.loaded = true
  });
  const broadcast = document.getElementById('broadcast_player_' + props.tweet_id)
  if (broadcast instanceof HTMLVideoElement) {
    const observer = new IntersectionObserver((entries, observer) => {
      if (broadcast.buffered) {
        if (entries[0].intersectionRatio > 0) {
          //plyrHandle.play()
          if (state.loaded) {
            hls.startLoad()
          }
        } else {
          //auto pause
          broadcast.pause()
          if (state.loaded) {
            hls.stopLoad()
          }
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

onMounted(() => {
  getBroadCastContent()
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

const getBroadCastContent = () => {
  //get id
  const id = props.url?.replaceAll(/https:\/\/twitter.com\/i\/broadcasts\/([^?]+)(\?.*|$)/gm, '$1')
  request<ApiBroadcast>(onlinePath.value + '/api/v3/data/broadcast/?id=' + id).then(response => {
    if (response.code === 200) {
      state.broadcastData = response.data
      if (!Hls.isSupported()) {
        Notice('Not supported HLS', 'error', 0)
      } else if (!response.data.playback && response.data.state !== 'not_started') {
        Notice('No playback link')
      }
    } else {
      Notice(`#${response.code} ${response.message}`)
    }
  }).catch(e => {
    Notice(String(e), "error")
  })
}

const etaSeconds = computed(() => (Number(state.broadcastData.start) - Number(now.value)) / 1000)

const etaContent = (seconds: 1 | 60 | 3600 | 86400 = 1) => {
  return 'ETA ' + Math.ceil(etaSeconds.value / seconds) + ' ' + t('public.time.' + secondsToText[seconds], Math.ceil(etaSeconds.value / seconds) === 1 ? 1 : 2)
}

const eta = computed(() => {
  if (etaSeconds.value <= 0) {
    return 'NOT START'
  } else if (etaSeconds.value < 60) {
    return etaContent(1)
  } else if (etaSeconds.value < 3600) {
    return etaContent(60)
  } else if (etaSeconds.value < 86400) {
    return etaContent(3600)
  } else {
    return etaContent(86400)
  }
})

watch(etaSeconds, () => {
  if (etaSeconds.value < 0 && (state.latestPing + 30000) < Number(now.value) && state.broadcastData.state === 'not_started') {
    console.log(state.latestPing, Number(now.value))
    getBroadCastContent()
    state.latestPing = Number(now.value)
  }
})
</script>

<style scoped>

</style>