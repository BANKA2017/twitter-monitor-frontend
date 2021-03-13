<template>
    <el-drawer id="settings" :visible.sync="$root.settings.panel" close-on-press-escape direction="btt" show-close size="25%"
               title="Settings">
        <div class="modal-body">
          <!--<label for="selectTranslator">Translator</label>
          <el-switch
              id="selectTranslator"
              style="display: block"
              v-model="value2"
              active-text="Google Translate"
              inactive-text="DeepL">
          </el-switch>
          <hr class="my-2">-->
            <label for="selectLaguage">Language</label>
            <select class="form-control" id="selectLaguage" v-model="$root.settings.data.language">
                <option :key="language.code" :selected="$root.settings.data.language === language.code"
                        :value="language.code" v-for="language in $root.languageList">{{ language.local_name }}
                </option>
            </select>
        </div>
    </el-drawer>
</template>

<script>
    export default {
        name: "settings"
    }
</script>

<style scoped>

</style>
