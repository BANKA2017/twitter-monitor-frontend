<template>
  <div class="settings">
    <navigation />
    <div class="my-4"></div>
    <main class="container" id="main" role="main">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="input-group mb-3">
            <span class="input-group-text" id="api_path">{{ t("settings.api_path") }}</span>
            <input v-model="settings.basePath" aria-describedby="api_path" aria-label="Sizing example input" class="form-control" type="text" disabled>
          </div>
          <label class="mb-3 text-muted form-label" for="api_path">{{ t("settings.default_api_path", [settings.onlineMode ? defaultOnlinePath : defaultBasePath]) }}</label>
          <div class="input-group mb-3">
            <span class="input-group-text" id="media_path">{{ t("settings.media_path") }}</span>
            <input v-model="settings.mediaPath" aria-describedby="media_path" aria-label="Sizing example input" class="form-control" type="text" disabled>
          </div>
          <label class="mb-3 text-muted form-label" for="media_path">{{ t("settings.default_media_path", [defaultMediaPath]) }}</label>
          <div class="input-group mb-3">
            <label class="input-group-text" for="select-language">{{ t("settings.language") }}</label>
            <select id="select-language" v-model="language" class="form-select">
              <option v-for="languageInfo in languageList" :key="languageInfo.code" :selected="language === languageInfo.code" :value="languageInfo.code">{{ languageInfo.local_name }}
              </option>
            </select>
          </div>
          <!--<div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="auto-refresh" v-model="autoRefresh">
            <label class="custom-control-label" for="auto-refresh">{{ t("settings.auto_refresh") }}</label>
          </div>-->
          <div class="form-check mb-1">
            <input type="checkbox" class="form-check-input" id="auto-load-more" v-model="autoLoadMore">
            <label class="custom-control-label form-label" for="auto-load-more">{{ t("settings.auto_load_tweets") }}</label>
          </div>
          <div class="form-check mb-1">
            <input type="checkbox" class="form-check-input" id="load-conversation" v-model="loadConversation">
            <label class="custom-control-label form-label" for="load-conversation">{{ t("settings.load_conversation") }}</label>
          </div>
          <div class="form-check mb-1">
            <input type="checkbox" class="form-check-input" id="online-mode" v-model="onlineMode">
            <label class="custom-control-label form-label" for="online-mode">{{ t("settings.online_mode") }}</label>
          </div>
          <div class="text-center my-4">
            <el-button circle @click="$router.go(-1)"><arrow-left height="1em" status="" width="1em"/></el-button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Navigation from "@/components/Navigation.vue"
import ArrowLeft from "@/icons/ArrowLeft.vue"
import {computed, defineComponent, watch} from "vue"
import {useStore} from "@/store"
import {useI18n} from "vue-i18n";

const { t } = useI18n()
const defaultBasePath = process.env.NODE_ENV !== "development" ? import.meta.env.VITE_PRO_BASE_PATH : import.meta.env.VITE_DEV_BASE_PATH
const defaultMediaPath = import.meta.env.VITE_MEDIA_PATH ? import.meta.env.VITE_MEDIA_PATH : defaultBasePath + '/api/v3/media/'
const defaultOnlinePath = import.meta.env.VITE_ONLINE_PATH ? import.meta.env.VITE_ONLINE_PATH : ''

const store = useStore()
const settings = computed(() => store.state.settings)
const languageList = computed(() => store.state.languageList)
const adminMode = computed(() => store.state.adminMode)

//const basePath = computed({
//  get () {return store.getters.getBasePath},
//  set (value: string) {store.dispatch("updateSettingsItem", {key: "basePath", value})}
//})
//const mediaPath = computed({
//  get () {return store.state.settings.mediaPath},
//  set (value: string) {store.dispatch("updateSettingsItem", {key: "mediaPath", value})}
//})

const language = computed({
  get () {return store.state.settings.language},
  set (value: string) {store.dispatch("updateSettingsItem", {key: "language", value})}
})

const autoRefresh = computed({
  get () {return store.state.settings.autoRefresh},
  set (value: boolean) {store.dispatch("updateSettingsItem", {key: "autoRefresh", value})}
})

const autoLoadMore = computed({
  get () {return store.state.settings.autoLoadTweets},
  set (value: boolean) {store.dispatch("updateSettingsItem", {key: "autoLoadTweets", value})}
})

const loadConversation = computed({
  get () {return store.state.settings.loadConversation},
  set (value: boolean) {store.dispatch("updateSettingsItem", {key: "loadConversation", value})}
})

const onlineMode = computed({
  get () {return store.state.settings.onlineMode},
  set (value: boolean) {
    store.dispatch('updateSettingsItem', {key: 'basePath', value: value ? defaultOnlinePath : defaultBasePath})
    store.dispatch("updateSettingsItem", {key: "onlineMode", value})
  }
})

</script>

<style scoped>

</style>
