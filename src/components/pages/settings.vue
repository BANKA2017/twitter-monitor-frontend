<template>
  <div class="settings">
    <navigation />
    <div class="my-4"></div>
    <main class="container" id="main" role="main">
      <div class="row">
        <div class="col-md-8 offset-2">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="api_path">{{ $t("settings.api_path") }}</span>
            </div>
            <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="api_path" v-model="$root.settings.data.basePath">
          </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="media_path">{{ $t("settings.media_path") }}</span>
            </div>
            <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="media_path" v-model="$root.settings.data.mediaPath">
          </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="selectLaguage">{{ $t("settings.language") }}</label>
            </div>
            <select class="custom-select" id="selectLaguage" v-model="$root.settings.data.language">
              <option :key="language.code" :selected="$root.settings.data.language === language.code"
                      :value="language.code" v-for="language in $root.languageList">{{ language.local_name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Navigation from "@/components/modules/Navigation";
export default {
  name: "settings",
  components: {Navigation}
}
</script>

<style scoped>

</style>
