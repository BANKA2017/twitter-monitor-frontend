<template>
  <div id="search-typeahead">
      <el-skeleton animated :rows="1" :loading="!!(queryString && active && state.loading)" class="mt-1" />
      <div class="list-group my-2" v-if="queryString && (state.typeaheadData.topics.length || state.typeaheadData.users.length)">
          <router-link v-for="topic in state.typeaheadData.topics" :to="`/search/?q=`+topic.topic" :key="topic.topic" class="py-3 list-group-item list-group-item-action fs-5">
              <span style="margin: 0 0.75em; ">{{ topic.topic }}</span>
          </router-link>
          <router-link v-for="user in state.typeaheadData.users" :to="`/${user.name}/all`" :key="user.name" class="list-group-item list-group-item-action">
              <div style="display: flex; align-content: start; margin: 0 0.5em; justify-content: start;">
                  <div class="" style="width: 45px; aspect-ratio: 1; display: inline-block; padding: 0.5em;" v-if="!settings.displayPicture">
                      <el-image class="rounded-circle" :src="createRealMediaPath(realMediaPath, samePath, 'userinfo')+user.header.replaceAll('https://', '').replace(/([\w]+)\.([\w]+)$/gm, `$1_reasonably_small.$2`)" :preview-src-list="[createRealMediaPath(realMediaPath, samePath, 'userinfo')+user.header.replaceAll('https://', '')]" alt="Avatar" preview-teleported hide-on-click-modal/>
                  </div>
                  <div style="padding: 0.5em 0.25em; display: inline-block; align-self: center">
                      <div class="mb-1" style="display: flex; justify-content: space-between; align-self: center;"><router-link :to="`/${user.name}/all`" class="text-dark" ><full-text class=" fw-bold" :entities="[]" :full_text_origin="user.display_name" :inline="true"/></router-link></div>
                  </div>
              </div>
          </router-link>
      </div>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, watch} from "vue";
import {useStore} from "../store";
import {request} from "../share/Fetch";
import {ApiTyprahead} from "../types/Api";
import {createRealMediaPath, Notice} from "../share/Tools";
import Verified from "../icons/Verified.vue";
import BlueVerifiedIcon from "../icons/BlueVerifiedIcon.vue";
import FullText from "./FullText.vue";
import {onBeforeRouteUpdate} from "vue-router";

const props = defineProps({
  queryString: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: false
  }
})

const store = useStore()
const settings = computed(() => store.state.settings)
const samePath = computed(() => store.state.samePath)
const realMediaPath = computed(() => store.state.realMediaPath)

const state = reactive<{
  typeaheadData: ApiTyprahead["data"]
  loading: boolean
}>({
  typeaheadData: {
    users: [],
    topics: []
  },
  loading: true
})

const getTypeahead = () => {
  if (!props.queryString || !props.active) {return}
  request<ApiTyprahead>(settings.value.basePath + '/api/v3/data/typeahead/?text=' + props.queryString).then(response => {
    if (response.data.topics.length || response.data.users.length) {
      state.typeaheadData = response.data
    }
    state.loading = false
  }).catch(e => {
    Notice(e.toString(), "error")
    state.loading = false
  })
}

const init = (timer) => {
    clearTimeout(timer)
    state.loading = true
    state.typeaheadData = {
        users: [],
        topics: []
    }
}

let timer = setTimeout(() => {})
watch(() => props.active, () => {
    if (props.active) {
        init(timer)
        timer = setTimeout(getTypeahead, 500)
    }
})
watch(() => props.queryString, () => {
    init(timer)
    timer = setTimeout(getTypeahead, 500)
})

onBeforeRouteUpdate((to, from) => {
    init(timer)
})

</script>
<style scoped>

</style>