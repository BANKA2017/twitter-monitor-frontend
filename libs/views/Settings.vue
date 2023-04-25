<template>
  <div class="settings">
    <div class="container" id="main" role="main">
      <div class="row">
        <div class="col-lg-3">
          <div style="position: sticky; top: 1rem;" >
            <div class="fs-2 fw-bold w-100 text-start">Twitter Monitor</div>
            <div class="mb-3" style="padding-left: 5px"><local-router /></div>
            <el-divider class="my-2" />
            <link-list v-if="!settings.onlineMode"/>
            <div v-else class="mb-2 text-muted"><small>NEST.MOE</small></div>
          </div>
        </div>
        <div class="col-lg-9">
          <div class="input-group" style="top: 2em;">
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
          <div class="input-group mb-3">
            <label class="input-group-text" for="select-platform">{{ t("settings.translator_platform") }}</label>
            <select id="select-platform" v-model="translatorPlatform" class="form-select">
              <option v-for="translateMeta in [['google', 'Google Translate'], ['microsoft', 'Microsoft Translator'], ['sogou', '搜狗翻译'], ['yandex', 'Yandex Translator'], ['baidu', '百度翻译'], ['deepl', 'DeepL']]" :key="translateMeta[0]" :selected="translatorPlatform === translateMeta[0]" :value="translateMeta[0]">{{ translateMeta[1] }}
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
          <div class="form-check mb-1" v-show="!force_online">
            <input type="checkbox" class="form-check-input" id="online-mode" v-model="onlineMode">
            <label class="custom-control-label form-label" for="online-mode">{{ t("settings.online_mode") }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, inject} from "vue"
import {useStore} from "../store"
import {useI18n} from "vue-i18n";
import {State} from "../types/State";
import LocalRouter from "../components/LocalRouter.vue";
import LinkList from "../components/LinkList.vue";

const { t } = useI18n()
const defaultBasePath = import.meta.env.NODE_ENV !== "development" ? import.meta.env.VITE_PRO_BASE_PATH : import.meta.env.VITE_DEV_BASE_PATH
const defaultMediaPath = import.meta.env.VITE_MEDIA_PATH ? import.meta.env.VITE_MEDIA_PATH : defaultBasePath + '/api/v3/media/'
const defaultOnlinePath = import.meta.env.VITE_ONLINE_PATH ? import.meta.env.VITE_ONLINE_PATH : ''

const store = useStore()
const settings = computed(() => store.state.settings)
const languageList = computed(() => store.state.languageList)
const adminMode = computed(() => store.state.adminMode)
const force_online = inject('online_mode')

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

const translatorPlatform = computed({
  get () {return store.state.settings.translatorPlatform},
  set (value: State["settings"]["translatorPlatform"]) {store.dispatch("updateSettingsItem", {key: "translatorPlatform", value})}
})

</script>

<style scoped>

</style>
