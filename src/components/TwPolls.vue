<template>
  <div id="twPolls" class="my-2">
    <div class="container no-gutters text-decoration-none">
      <div class="row">
        <div class="card mx-auto my-3" v-if="media.length">
          <div class="row">
            <el-image alt="pollImage" :preview-src-list="[createRealMediaPath(realMediaPath, samePath, 'tweets')+media[0].url+'']" :src="createRealMediaPath(realMediaPath, samePath, 'tweets')+media[0].url+''" class="col-12 card-img-top" fit="cover" lazy style="height: 300px"></el-image>
          </div>
        </div>
        <div v-if="etaSeconds <= 0 && ((!settings.onlineMode && polls[0].checked) || (settings.onlineMode && state.updateFlag && state.polls.length)) && pollCount > 0" class="col-12">
          <div class="progress" v-for="(poll, index) in polls" :key="poll.poll_order">
            <div :style="{'background-color': maxPollIndex === index ? '#7CC5F6' : '#CFD9DE',  width: Math.ceil(((settings.onlineMode ? state.polls[index] : poll.count)/pollCount)*100) + '%'}" class="progress-bar"></div>
            <div class="progress-data">
              <span :class="{'fw-bold': maxPollIndex === index, 'fw-normal': maxPollIndex !== index}">{{ poll.choice_label }}</span>
              <span :class="{'fw-bold': maxPollIndex === index, 'fw-normal': maxPollIndex !== index}">{{ Math.ceil(((settings.onlineMode ? state.polls[index] : poll.count)/pollCount)*100) + '%' }}</span>
            </div>
          </div>
        </div>
        <template v-else>
          <el-button @click="e => {e.stopPropagation()}" round class="btn-block mx-auto mb-1" v-for="poll in polls" :key="poll.poll_order">{{ poll.choice_label }}</el-button>
        </template>
        <div class="col-12 my-1" >
          <small class="text-muted me-1">{{ eta }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Media, PollItem} from "@/type/Content";
import {computed, PropType, reactive, watch} from "vue";
import {useStore} from "@/store";
import {useI18n} from "vue-i18n";
import {createRealMediaPath, Notice} from "@/share/Tools";
import {secondsToText} from "@/share/Time";
import {request} from "@/share/Fetch";
import {ApiPolls} from "@/type/Api";

const props = defineProps({
  tweetId: {
    type: String,
    default: 0
  },
  polls: {
    type: Array as PropType<PollItem[]>,
    default: () => ([])
  },
  media: {
    type: Array as PropType<Media[]>,
    default: () => []
  }
})

const state = reactive<{
  polls: number[]
  updateFlag: boolean
}>({
  polls: [],
  updateFlag: false
})

const {t} = useI18n()
const store = useStore()
const now = computed(() => store.state.now)
const settings = computed(() => store.state.settings)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)

const pollCount = computed(() => {
  if (settings.value.onlineMode && state.polls.length > 0) {
    return state.polls.reduce((a, b) => a + b, 0)
  } else {
    return props.polls.map(x => x.count).reduce((a, b) => a + b, 0)
  }
})
const etaSeconds = computed(() => (props.polls[0].end_datetime * 1000 - Number(now.value)) / 1000)

if (settings.value.onlineMode) {
  watch(etaSeconds, () => {
    if (etaSeconds.value < 0 && state.polls.length === 0 && !state.updateFlag) {
      state.updateFlag = true
      request<ApiPolls>(settings.value.basePath + '/api/v3/data/poll/?tweet_id=' + props.tweetId).then(response => {
        if (response.code === 200) {
          state.polls = response.data
        } else {
          Notice(response.message, "error")
        }
      }).catch(e => {
        Notice(String(e), "error")
      })
    }
  })
}

const etaContent = (seconds: 1 | 60 | 3600 | 86400 = 1) => {
  return t("polls.vote", {count: pollCount.value}, pollCount.value > 1 ? 2 : 1) + ' · ' + t("polls.eta", [Math.ceil(etaSeconds.value / seconds) + ' ' + t('public.time.' + secondsToText[seconds], Math.ceil(etaSeconds.value / seconds) === 1 ? 1 : 2)])
}
const eta = computed(() => {
  if (etaSeconds.value <= 0 && (props.polls[0].checked || settings.value.onlineMode)) {
    return t("polls.vote", {count: pollCount.value}, pollCount.value > 1 ? 2 : 1) + ' · ' + t("polls.final_results");
  } else if (etaSeconds.value <= 0) {
    return t("polls.vote", {count: pollCount.value}, pollCount.value > 1 ? 2 : 1) + ' · ' + t("polls.wait_for_sync");
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

const maxPollIndex = computed(() => {
  let tmpMaxIndex = -1
  let tmpPolls = state.polls
  if (!settings.value.onlineMode) {
    tmpPolls = props.polls.map(poll => poll.count)
  }
  tmpPolls.forEach((count, index) => {
    if (tmpMaxIndex === -1 || tmpPolls[tmpMaxIndex] < count) {
      tmpMaxIndex = index
    }
  })
  return tmpMaxIndex
})

</script>

<style scoped lang="scss">
  .progress {
    height: 2em;
    font-size: 1em;
    border-radius: 0.375em;
    position: relative;
    width: 100%;
    margin-bottom: 0.375em;
    &>.progress-data {
      position: absolute;
      padding: 0.35em 0.75em;
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 100%;
    }
    &>.progress-bar {
      position: absolute;
      height: 100%;
      border-radius: 0.375em;
    }
  }
</style>
