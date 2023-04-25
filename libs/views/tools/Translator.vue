<template>
  <navigation />
  <div id="translator" class="container mt-5">
    <div class="row">
      <div class="col-md-6">
        <p v-if="route.name === 'translator-empty'">请填写链接再看这边</p>
        <tweets v-else />
      </div>
      <div class="col-md-6">
        Nothing Here
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import Tweets from "../../components/Tweets.vue";
import Navigation from "../../components/Navigation.vue";
import {useStore} from "../../store";
import {computed} from "vue";
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";

// store
const store = useStore()
const translateList = computed(() => store.state.translate)
const tweetList = computed(() => store.state.tweets)

// router
const route = useRoute()
const router = useRouter()

const onlineModeFlag = store.state.settings.onlineMode

if (!onlineModeFlag) {
  store.dispatch('updateSettingsItem', {key: 'onlineMode', value: true})
}

onBeforeRouteLeave(() => {
  if (!onlineModeFlag) {
    store.dispatch('updateSettingsItem', {key: 'onlineMode', value: false})
  }

})

</script>

<style scoped>

</style>