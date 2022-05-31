<template>
  <div class="my-2" v-if="state.display">
    <router-link :to="'/hashtag/' + hashTag.name" class="badge text-bg-light me-2" v-for="(hashTag, key) in state.list" :key="key">{{ hashTag.name }}</router-link>
  </div>
</template>

<script setup lang="ts">

import {useStore} from "@/store"
import {computed, reactive} from "vue"
import {HashtagList} from "@/type/Content";
import {Controller, request} from "@/share/Fetch";
import {ApiHashtagList} from "@/type/Api";

const state = reactive<{
  list: HashtagList[]
  display: boolean
}>({
  list: [],
  display: false
})
const controller = new Controller()
const store = useStore()
const settings = computed(() => store.state.settings)
request<ApiHashtagList>(settings.value.basePath + '/api/v2/data/hashtag_rank/?count=20', controller).then(response => {
  if (response.code === 200) {
    state.list = response.data.list
    state.display = true
  } else {
    state.display = false
  }
}).catch(e => {
  state.display = false
})


</script>

<style scoped>

</style>