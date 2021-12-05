<template>
    <el-drawer id="settings" v-model:visible="settings.panel" close-on-press-escape direction="btt" show-close size="25%"
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
            <select id="selectLaguage" v-model="languageCode" class="form-control">
                <option v-for="language in languageList" :key="language.code"
                        :selected="(languageCode === language.code)" :value="language.code">{{ language.local_name }}
                </option>
            </select>
        </div>
    </el-drawer>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "settings",
        data: () => ({
          languageCode: 'zh-cn'//
        }),
        computed: mapState({
          settings: 'settings',
          languageList: 'languageList',
        }),
      watch: {
          "languageCode": function () {
            this.$store.dispatch({
              type: 'setLanguage',
              lang: this.languageCode
            })
          }
      }
    }
</script>

<style scoped>

</style>
