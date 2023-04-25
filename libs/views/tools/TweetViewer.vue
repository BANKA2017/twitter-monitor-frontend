<template>
  <div id="tweet-viewer">
    <div class="container">
      <div class="row">
        <div class="col-md-6">

        </div>
        <div class="col-md-6">
          <div v-if="state.tweet">
            <tweet-item :tweet="{}" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TweetItem from "../../components/TweetItem.vue";
import {useStore} from "../../store";
import {computed} from "vue";
import {request} from "../../share/Fetch";
import {ApiTweets} from "../../types/Api";
import {Notice} from "../../share/Tools";

const store = useStore()
const onlinePath = computed(() => store.state.onlinePath)
request<ApiTweets>(state.url + '?' + tmpQueryObject.toString(), controllerList.loading).then(response => {
  if (top) {
    Notice(t("timeline.scripts.message.update_tweets", {count: response.data.tweets.length}), "success");//this.getUserInfo();if (response.data.top_tweet_id && response.data.top_tweet_id !== "0") {
    if (response.data.top_tweet_id !== '0') {
      state.topTweetId = response.data.top_tweet_id;
    }
    store.dispatch({
      type: 'setCoreValue',
      key: 'tweets',
      value: [...response.data.tweets, ...tweets.value]
    })
    state.loadingTop = false
  } else {
    state.moreTweets = response.data.hasmore;
    if (response.data.bottom_tweet_id !== '0') {
      state.bottomTweetId = response.data.bottom_tweet_id;
    }
    store.dispatch({
      type: 'pushCoreValue',
      key: 'tweets',
      value: [...response.data.tweets]
    })
    state.loadingBottom = false
  }
}).catch(e => {
  if (top) {
    state.loadingTop = false
  } else {
    state.loadingBottom = false
  }
  if (controllerList.loading.afterAbortSignal.aborted) {
    Notice(t("public.loading"), "warning")
  } else {
    Notice(String(e), "error")
  }
})
</script>

<style scoped>

</style>