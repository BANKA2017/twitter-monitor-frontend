<template>
  <div class="settings">
    <navigation />
    <div class="my-4"></div>
    <main class="container" id="main" role="main">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="api_path">{{ $t("settings.api_path") }}</span>
            </div>
            <input v-model="basePath" aria-describedby="api_path" aria-label="Sizing example input" class="form-control" type="text">
          </div>
          <label class="mb-3 text-muted" for="api_path">{{ $t("settings.default_api_path", [defaultBasePath]) }}</label>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="media_path">{{ $t("settings.media_path") }}</span>
            </div>
            <input v-model="mediaPath" aria-describedby="media_path" aria-label="Sizing example input" class="form-control" type="text">
          </div>
          <label class="mb-3 text-muted" for="media_path">{{ $t("settings.default_media_path", [defaultMediaPath]) }}</label>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="selectLaguage">{{ $t("settings.language") }}</label>
            </div>
            <select id="selectLaguage" v-model="language" class="custom-select">
              <option v-for="languageInfo in languageList" :key="languageInfo.code" :selected="language === languageInfo.code" :value="languageInfo.code">{{ languageInfo.local_name }}
              </option>
            </select>
          </div>
          <div class="text-center my-4">
            <el-button circle @click="$router.go(-1)"><arrow-left height="1em" status="" width="1em"/></el-button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Navigation from "@/components/Navigation.vue"
import ArrowLeft from "@/icons/ArrowLeft.vue"
import {computed, defineComponent} from "vue"
import {useStore} from "@/store"
export default defineComponent({
  components: {ArrowLeft, Navigation},
  setup() {
    const defaultBasePath = process.env.NODE_ENV !== "development" ? import.meta.env.VITE_PRO_BASE_PATH : import.meta.env.VITE_DEV_BASE_PATH
    const defaultMediaPath = import.meta.env.VITE_MEDIA_PATH ? import.meta.env.VITE_MEDIA_PATH : defaultBasePath + '/api/v2/media/'

    const store = useStore()
    const languageList = computed(() => store.state.languageList)
    const basePath = computed({
      get () {
        return store.state.settings.basePath
      },
      set (value) {
        store.dispatch({type: 'updateBasePath', basePath: value})
      }
    })
    const mediaPath = computed({
      get () {
        return store.state.settings.mediaPath
      },
      set (value) {
        store.dispatch({type: 'updateMediaPath', mediaPath: value})
      }
    })

    const language = computed({
      get () {
        return store.state.settings.language
      },
      set (value) {
        store.dispatch({type: 'setLanguage', lang: value})
      }
    })

    return {defaultBasePath, defaultMediaPath, languageList, basePath, mediaPath, language}
  }
})
</script>

<style scoped>

</style>
