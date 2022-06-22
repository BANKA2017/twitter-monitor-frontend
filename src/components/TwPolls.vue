<template>
  <div id="twPolls">
    <div class="my-4"></div>
    <div class="container text-decoration-none">
      <div class="row no-gutters">
        <div class="card mx-auto my-3" v-if="media.length">
          <div class="row no-gutters">
            <el-image alt="pollImage" :preview-src-list="[createRealMediaPath(realMediaPath, samePath, 'tweets')+media[0].url+'']" :src="createRealMediaPath(realMediaPath, samePath, 'tweets')+media[0].url+''" class="col-12 card-img-top" fit="cover" lazy style="height: 300px"></el-image>
          </div>
        </div>
        <div v-if="!settings.onlineMode && etaSeconds <= 0 && polls[0].checked" class="col-12">
          <el-progress class="mb-1" :percentage="Math.ceil((poll.count/pollCount)*100)" v-for="poll in polls" :format="() => poll.choice_label+' (' + Math.ceil((poll.count/pollCount)*100) + '%)'" :key="poll.poll_order"></el-progress>
        </div>
        <template v-else>
          <el-button round class="btn-block mx-auto mb-1" v-for="poll in polls" :key="poll.poll_order">{{ poll.choice_label }}</el-button>
        </template>
        <div class="col-12 my-4" v-if="!settings.onlineMode"><small class="text-muted">{{ eta }}</small></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Media, PollItem} from "@/type/Content";
import {computed, PropType} from "vue";
import {useStore} from "@/store";
import {useI18n} from "vue-i18n";
import {createRealMediaPath} from "@/share/Tools";
import {secondsToText} from "@/share/Time";

const props = defineProps({
  polls: {
    type: Array as PropType<PollItem[]>,
    default: () => ([])
  },
  media: {
    type: Array as PropType<Media[]>,
    default: () => []
  }
})

const {t} = useI18n()
const store = useStore()
const now = computed(() => store.state.now)
const settings = computed(() => store.state.settings)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)

const pollCount = computed(() => {
  let count = 0
  props.polls.forEach(poll => {
    count += poll.count
  });
  return count
})
const etaSeconds = computed(() => (props.polls[0].end_datetime * 1000 - Number(now.value)) / 1000)

const etaContent = (seconds: 1 | 60 | 3600 | 86400 = 1) => {
  return t("polls.vote", {count: pollCount.value}, pollCount.value > 1 ? 2 : 1) + ' · ' + t("polls.eta", [Math.ceil(etaSeconds.value / seconds) + ' ' + t('public.time.' + secondsToText[seconds], Math.ceil(etaSeconds.value / seconds) === 1 ? 1 : 2)])
}
const eta = computed(() => {
  if (etaSeconds.value <= 0 && props.polls[0].checked) {
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

</script>

<style scoped>

</style>
