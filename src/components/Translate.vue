<template>
  <div id="translate">
    <!--translate-->
    <div v-if="state.status === 0" class='card-text'>
      <span role="button" class="text-decoration-none"><small style="color:#1DA1F2; font-size: 0.8rem" @click="runTranslate(props.id)">{{ type === '1' ? t("translate.message.translate_profile") : t("translate.message.translate_tweet") }}</small></span>
    </div>
    <div v-else-if="state.status === 1" style="color:#1DA1F2">
      <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    </div>
    <div v-else>
      <el-divider class="my-4" />
      <p class='card-text'><small class="text-muted">{{ t("translate.message.translate_by", [state.translate_source]) }}</small></p>
      <full-text class="card-text" :entities="[]" :full_text_origin="state.text" />
      <div class="text-decoration-none" role="button"><small style="color:#1DA1F2; font-size: 0.8rem" @click="state.status = 0">{{ t("translate.message.hide_translated") }}</small></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useStore} from "@/store";
import {computed, reactive, watch} from "vue";
import {Notice} from "@/share/Tools";
import {Controller, request} from "@/share/Fetch";
import {ApiTranslate} from "@/type/Api";
import {useI18n} from "vue-i18n";
import FullText from "@/components/FullText.vue";
const props = defineProps({
  type: {
    type: String,
    validator(value: string): boolean {
      return ['0', '1'].includes(value)
    }
  },
  id: {
    type: String,//tweet_id or uid
    default: "-1"
  },
  to: {
    type: String,
    validator(value: string): boolean {
      return ['zh-cn', 'zh-tw', 'zh-hans', 'zh-hant', 'en', 'ja', 'ko'].includes(value)
    }
  },
})

const { t } = useI18n()

const store = useStore()
const settings = computed(() => store.state.settings)
const translate = computed(() => store.state.translate)
const toLanguage = computed((): string => {
  if (String(props.to) === 'zh_hans') { return 'zh-cn'}
  if (String(props.to) === 'zh_hant') { return 'zh-tw'}
  return String(props.to)
})

const state = reactive<{
  status: 0 | 1 | 2;
  text: string;
  translate_source: string
}>({
  status: 0,
  text: "",
  translate_source: "",
})

watch(translate, () => {
  if (String(props.type) === '0') {
    if (translate.value[props.id]!==undefined) {
      state.text = translate.value[props.id].text
      state.translate_source = translate.value[props.id].translate_source
      state.status = 2
    } else {
      state.text = ''
      state.translate_source = ''
      state.status = 0
    }
  }
}, {deep: true})

const runTranslate = (id: string = '0') => {
  //type为0即推文, 为1即用户信息
  state.status = 1;
  if (String(props.type) === '0') {
    request<ApiTranslate>(settings.value.basePath + '/api/v2/data/translate/?tr_type=tweets&tweet_id=' + id + '&to=' + toLanguage.value, new Controller()).then(response => {
      store.dispatch({type: "updateTweetsTranslate", tweet_id: props.id, translate: {text: response.data.translate, translate_source: response.data.translate_source}})
      state.text = response.data.translate
      state.translate_source = response.data.translate_source
      state.status = 2
    }).catch(e => {
      state.status = 0
      Notice(String(e), 'error')
    })
  } else if (String(props.type) === '1') {
    request<ApiTranslate>(settings.value.basePath + '/api/v2/data/translate/?tr_type=profile&uid=' + id + '&to=' + toLanguage.value, new Controller()).then(response => {
      state.text = response.data.translate
      state.translate_source = response.data.translate_source
      state.status = 2
    }).catch(e => {
      state.status = 0
      Notice(String(e), 'error')
    })
  } else {
    Notice(t("public.error"), "error")
  }
}
</script>

<style scoped>

</style>
