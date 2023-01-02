<template>
  <div id="online-tweet-item">
    <el-skeleton :loading="state.loading && Object.keys(state.tweetData).length === 0" :rows="5" animated style="width: 100%;">
      <tweet-item :tweet="state.tweetData" v-if="!state.loading && Object.keys(state.tweetData).length > 0" />
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">

import {Notice} from "@/share/Tools";

const props = defineProps({
  tweet_id: {
    type: [Number, String],
    default: 0
  }
})

import {useStore} from "@/store";
import {computed, onMounted, reactive} from "vue";
import TweetItem from "@/components/TweetItem.vue";
import {Tweet} from "@/type/Content";
import {request} from "@/share/Fetch";
import {ApiTweets} from "@/type/Api";

const store = useStore()
const onlinePath = computed(() => store.state.onlinePath)

const state = reactive<{
  loading: boolean
  tweetData: Tweet | {}
}>({
  loading: true,
  tweetData: {}
})

onMounted(() => {
  request<ApiTweets>(onlinePath.value + '/api/v3/data/tweets/?is_status=1&load_conversation=0&tweet_id=' + String(props.tweet_id)).then(response => {
    state.tweetData = response.data.tweets[0]
    state.loading = false
  }).catch(e => {
    Notice(e.toString(), 'error')
  })
})

</script>

<style scoped>

</style>