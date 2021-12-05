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
              <option v-for="languageInfo in languageList" :key="languageInfo.code"
                      :selected="language === languageInfo.code" :value="languageInfo.code">{{ languageInfo.local_name }}
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

<script>
import Navigation from "@/components/modules/Navigation";
import ArrowLeft from "@/components/icons/arrowLeft";
export default {
  name: "settings",
  components: {ArrowLeft, Navigation},
  data: () => ({
    defaultBasePath: process.env.NODE_ENV !== "development" ? process.env.VUE_APP_PRO_BASE_PATH : process.env.VUE_APP_DEV_BASE_PATH,
    defaultMediaPath: process.env.VUE_APP_MEDIA_PATH ? process.env.VUE_APP_MEDIA_PATH : this.defaultBasePath + '/api/v2/media/'
  }),
  computed: {
    languageList: function () {
      return this.$store.state.languageList
    },
    basePath: {
      get () {
        return this.$store.state.settings.data.basePath
      },
      set (value) {
        this.$store.dispatch({
          type: 'updateBasePath',
          basePath: value
        })
      }
    },
    mediaPath: {
      get () {
        return this.$store.state.settings.data.mediaPath
      },
      set (value) {
        this.$store.dispatch({
          type: 'updateMediaPath',
          mediaPath: value
        })
      }
    },
    language: {
      get () {
        return this.$store.state.settings.data.language
      },
      set (value) {
        this.$store.dispatch({
          type: 'setLanguage',
          lang: value
        })
      }
    },
  },
}
</script>

<style scoped>

</style>
